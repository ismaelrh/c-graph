import com.google.gson.Gson;
import edu.uci.ics.jung.algorithms.scoring.PageRank;
import org.apache.jena.query.*;
import spark.Request;
import spark.Response;
import spark.Spark;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Formatter;
import java.util.List;

import static spark.Spark.*;

/**
 * Created by ismar on 15/11/2016.
 */
public class Main {




    static Gson gson = new Gson();
  public static void main( String[] args ) {

    Spark.port(8080);
    staticFiles.location("/frontend"); // Static files
    options("/*",
            (request, response) -> {

              String accessControlRequestHeaders = request
                      .headers("Access-Control-Request-Headers");
              if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers",
                        accessControlRequestHeaders);
              }

              String accessControlRequestMethod = request
                      .headers("Access-Control-Request-Method");
              if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods",
                        accessControlRequestMethod);
              }

              return "OK";
            });

    before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));

    System.out.println("Server is up at port 8080. Make sure that Jena Fuseki is running");

    get("/query", (req, res) -> returnJson(req,res,req.queryParams("property")));

  }



  public static String returnJson(Request req, Response res, String property){

    System.out.println("Query from" +  req.ip());


    if(property.equalsIgnoreCase("category")){
      property =  "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>";
    }
    else{
      property = "<http://copyrightevidence.org/evidence-wiki/index.php/Special:URIResolver/Property-3A" + property + ">";
    }




    res.header("Content-Type","application/json");
    //Check if it is in cache
    String fileName = normalizeCamelCase(property) + ".json";
    File file = new File(fileName);
    try{
      if(file.exists() && file.isFile()){

        return readFile(fileName, Charset.defaultCharset());
      }
      else{

        List<Node> graph =
          generateGroupingGraph(property);


        Formatter formatter = new Formatter(file);
        String response =  gson.toJson(graph);

        //Write result to file
        formatter.format(response);
        formatter.flush();
        formatter.close();

        //Return result to client
        return gson.toJson(graph);
      }
    }
    catch(Exception ex){
      ex.printStackTrace();
      return "Error " + ex.getMessage();
    }



  }

  static String readFile(String path, Charset encoding)
    throws IOException
  {
    byte[] encoded = Files.readAllBytes(Paths.get(path));
    return new String(encoded, encoding);
  }

  public static String normalizeCamelCase(String inputString) {
    String checkForFoaf = inputString;

    inputString = inputString.replace("<", "");
    inputString = inputString.replace(">", "");
    inputString = inputString.replace("_","");
    int len = inputString.length();

    int last = inputString.lastIndexOf("/");
    inputString = inputString.substring(last + 1);
    //inputString = inputString.remove(0, last+1);

    String updated = "";

    for (int idx = 0; idx < inputString.length(); idx++) {
      char currentChar = inputString.charAt(idx);
      int ascii = (int) currentChar;

      if (ascii >= 65 && ascii <= 90) {
        //Found upper case. Add space
        updated = updated + " " + currentChar;
      } else {
        updated = updated + currentChar;
      }

      //Eliminamos espacios de delante y detras
      updated = updated.trim();


    }


    if (checkForFoaf.contains("foaf"))
    //todo: ¿esta bien? El de mongo devuelve con foaf name -> name

    { updated =  updated.toLowerCase().trim(); }

    return updated;
  }


  public static List<Node> generateGroupingGraph(String property){
    List<CountObject> groups = getGroups(property);
    List<Node> result = new ArrayList<Node>();
    for(CountObject group: groups){
      String currentValue = group.get_id();
      List<CountObject> linksForValue = getLinks(property,"<" + currentValue + ">");
      if(linksForValue != null){
        Node node = new Node(normalizeCamelCase(group.get_id()),group.getCount());
        for(CountObject edge: linksForValue){
          node.addEdge(normalizeCamelCase(edge.get_id()),edge.getCount());
        }
        result.add(node);
      }

    }
    return result;
  }

  public static List<CountObject> getLinks(String property, String valueGroupedBy){
    //System.out.println("Obtaining groups for property " );


    List<CountObject> result = new ArrayList<CountObject>();
    String s2 = "SELECT  ?countryDest (COUNT(?destination) AS ?count){\n" +
      "  \n" +
      "  ?origin " + property + " " + valueGroupedBy + ".\n" +
      "  ?origin <http://copyrightevidence.org/evidence-wiki/index.php/Special:URIResolver/Property-3AHas_reference_to> ?destination .\n" +
      "  ?destination " + property + " ?countryDest\n" +
      "  \n" +
      "}\n" +
      "GROUP BY ?countryDest\n" +
      "\n";

    //System.out.println(s2);
    Query query = QueryFactory.create(s2); //s2 = the query above
    QueryExecution qExe = QueryExecutionFactory.sparqlService( "http://localhost:3030/euhackathon/sparql", query );
    ResultSet results = qExe.execSelect();

    int totalCites = 0;
    while(results.hasNext()){
      QuerySolution row = results.next();
      //System.out.println(row);
      if(row.getLiteral("count") != null && row.getResource("countryDest")!=null){
        int count = row.getLiteral("count").getInt();
        String countryDest = row.getResource("countryDest").getURI().toString();
        if(!countryDest.equalsIgnoreCase(valueGroupedBy))        {
          totalCites+=count;
        }

        //System.out.println(countryDest + " - " + count);
        if(filter(property,countryDest,count)){
          result.add(new CountObject(countryDest,count));
        }

      }

      //result.add(new CountObject(group,count));
    }


    if(totalCites<=10 && property.contains("written")){
               return null;
    }
    return result;

  }

  public static List<CountObject> getGroups(String property){




    List<CountObject> result = new ArrayList<CountObject>();
    String s2 = "SELECT ?group (COUNT(?subject) as ?count)\n" +
      "WHERE{\n" +
      "  ?subject " + property + " ?group\n" +
      "}\n" +
      "GROUP BY ?group\n";

    Query query = QueryFactory.create(s2); //s2 = the query above
    QueryExecution qExe = QueryExecutionFactory.sparqlService( "http://localhost:3030/euhackathon/sparql", query );
    ResultSet results = qExe.execSelect();

    //System.out.println("Hola");
    //System.out.println(results.getRowNumber());

    while(results.hasNext()){
      QuerySolution row = results.next();
      if(row.getLiteral("count")!=null && row.getResource("group")!= null){
        int count = row.getLiteral("count").getInt();
        String group = row.getResource("group").getURI().toString();
        //System.out.println(group);

        if(filter(property,group,count)){
          result.add(new CountObject(group,count));
        }

      }

    }

    //ResultSetFormatter.out(System.out, results, query) ;

    return result;
  }



  public static boolean filter(String property, String value, int count){

   if(property.contains("written")){
     if(count<=1){
       return false;
     }
     else{
       return true;
     }
   }

    System.out.println(value);

    int lastIndex = value.lastIndexOf("/");
    String cutVal = value.substring(lastIndex+1,value.length());
    if(property.contains("Has_country")) {


        switch(cutVal){
          case "Spain":
            return true;
          case "Belgium":
            return true;
          case "France":
            return true;
          case "Italy":
            return true;
          case "Germany":
            return true;
          case "Greece":
            return true;
          case "Ireland":
            return true;
          case "Portugal":
            return true;
          case "Sweden":
            return true;
          case "United Kingdom":
            return true;

          default:
            return false;
        }
    }
    else{
        return true;
    }
  }
}

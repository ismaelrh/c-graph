import java.util.ArrayList;
import java.util.List;

/**
 * Created by ismar on 15/11/2016.
 */
public class Node {

  String title;
  int weight;
  List<Arc> outgoing_edges;

  public Node(String title, int weight){
    this.title = title;
    this.weight = weight;
    this.outgoing_edges = new ArrayList<Arc>();
  }

  public void addEdge(String destination, int weight){
    this.outgoing_edges.add(new Arc(destination,weight));
  }



  private class Arc {

    public String destination;
    public int weight;

    public Arc(String destination, int weight){
      this.destination = destination;
      this.weight = weight;
    }

  }


}



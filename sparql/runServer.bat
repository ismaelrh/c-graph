  <div>
          <b class="text">Group by:&nbsp;</b>

          <select id="groupSelect" class="option_button" onchange="changeSelect();">
            <option value="Was_written_by">Author</option>
            <option value="Category" >Category</option>
            <option value="Has_country" selected="selected">Country</option>
          </select>
        </div>
		<button id="reset-button" type="button" onclick="resetNodes()">Clear</button>
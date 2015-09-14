// online data

function get(url) {
    var out;
    $.ajax({
        url: url,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + token);
        }
    })
    .done(main)
}

// offline & online

var //rawRawData 
    // rawRawData = $.getJSON('TCexample.json'), //offline
    baseUrl = "https://creatorci.eu.zmags.com/",
    // url = "https://creatorci.eu.zmags.com/job/mosaik-master-functionaltests/135/api/json?tree=*,subBuilds[*]&depth=1",
    url = "https://creatorci.eu.zmags.com/job/mosaik-master-functionaltests/api/json?tree=allBuilds[*,subBuilds[*]]{0,20}&depth=1",
    token = "cG9oOjhhYWUwNTc3MTQ4NzI0ZGMwZjBlYTdmNTE3MjU5YzMy";;

get(url);

function main (data){
    var rawRawData = data;
    var rawData = rawRawData;
    $("#containerRaw").text(JSON.stringify(rawData, null, 4));
    $("#buttonRaw").click(function() {
    	$("#containerRaw").toggle();
    });

    var table = document.getElementById('table');
    var row = table.insertRow(0);
    var cell = row.insertCell(0);
    cell.innerHTML = "TC Build";
    var row = table.insertRow(1);
    var cell = row.insertCell(0);
    cell.innerHTML = "Duration";
    var row = table.insertRow(2);
    var cell = row.insertCell(0);
    cell.innerHTML = "Timestamp";
 

    for (var j = 0; j < rawData.allBuilds.length; j++) {
    	buildData = rawData.allBuilds[j];
        var cell = table.rows[0].insertCell(-1);
        cell.innerHTML = "<a href='" + buildData.url + "'>" + buildData.displayName + "</a>";
        switch (buildData.result) {
    			case "SUCCESS":
    				tdclass = "success";
    				break;
    			case "UNSTABLE":
    				tdclass = "fail";
    				break;
    			default:
                    if (buildData.building == true) {
                        tdclass = "building";
                    } else {
                        tdclass = "unknown";
                    }
    				break;
            }
        cell.setAttribute('class',tdclass);    
        var cell = table.rows[1].insertCell(-1);
        dur = new Date(buildData.duration);
        if (buildData.building) {
            cell.innerHTML = "building";
        } else {
            cell.innerHTML = dur.getMinutes() + ":" + ("00" + dur.getSeconds()).substr(-2,2) + "." + dur.getMilliseconds();
        }
        var cell = table.rows[2].insertCell(-1);
        cell.innerHTML = new Date(buildData.timestamp).toString().split(" ")[4];
        
    	for (var i = 0; i < buildData.subBuilds.length; i++) {
    		subBuildData = buildData.subBuilds[i];
    		switch (subBuildData.result) {
    			case "SUCCESS":
    				tdclass = "success";
    				break;
    			case "UNSTABLE":
    				tdclass = "fail";
    				break;
    			default:
    				tdclass = "unknown";
    				break;
            }
            var jobName = subBuildData.jobName,
                url = baseUrl + subBuildData.url + "/TestComplete/",
                buildNumber = subBuildData.buildNumber;
            //var indexOf;
            if (!document.getElementById(jobName)) {
                var row = table.insertRow(-1);
                row.setAttribute('id',jobName);
                // $("#table").append("<tr id=" + jobName + ">");
                var cell = row.insertCell(0);
                cell.innerHTML = jobName;
                // $("#table").append("   <td> " + jobName + " </td>");
                cell = row.insertCell(1);
                cell.setAttribute('class',tdclass);
                cell.innerHTML = "<a href='" + url + "'>" + buildNumber + "</a>";
                // $("#table").append("   <td class='" + tdclass + "'><a href='" + url + "'>" + buildNumber + "</a></td>");
                // $("#table").append("</tr>");
            } else {
                var row = document.getElementById(jobName);
                var cell = row.insertCell(-1);
                cell.setAttribute('class',tdclass);
                cell.innerHTML = "<a href='" + url + "'>" + buildNumber + "</a>";
            }            
        }
        for (i = 0; i < table.children.length ; i++) {
            var row = table.children[i];
            if (row.children.length  < table.children[0].children.length) {
                var cell = row.insertCell(1);
                cell.setAttribute('class',"pending");
                cell.innerHTML = "n/a";
            }
        }

    }
};

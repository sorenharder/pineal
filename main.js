// online data

function get(url) {
    // var out;
    $.ajax({
        url: url,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + token);
        }
    })
    .done(main);
}

// offline & online

var //rawRawData 
    // rawRawData = $.getJSON('TCexample.json'), //offline
    baseUrl = "https://creatorci.eu.zmags.com/",
    paramSkip = 0,
    paramNumBuilds = 24,
    // url = "https://creatorci.eu.zmags.com/job/mosaik-master-functionaltests/135/api/json?tree=*,subBuilds[*]&depth=1",
    // url = "https://creatorci.eu.zmags.com/job/mosaik-master-functionaltests/api/json?tree=allBuilds[*,subBuilds[*]]{0,20}&depth=1",
    // to get build (master/branch): https://creatorci.eu.zmags.com/job/mosaik-master-functionaltests/api/json?tree=allBuilds[actions[parameters[*]]]{21,22}&depth=1&pretty
    url = "https://creatorci.eu.zmags.com/job/mosaik-master-functionaltests/api/json?tree=allBuilds[*,subBuilds[*]]{" +
                paramSkip + "," + paramNumBuilds + "}&depth=1",
    token = "cG9oOjhhYWUwNTc3MTQ4NzI0ZGMwZjBlYTdmNTE3MjU5YzMy";

    get(url);
    
function reload(url) {
    document.getElementById('table').innerHTML = '';
    paramSkip = parseInt(document.getElementById('skip').value,10);
    paramNumBuilds = parseInt(document.getElementById('num_builds',10).value);
    paramNumBuildsTotal = paramSkip +  paramNumBuilds;
    url = "https://creatorci.eu.zmags.com/job/mosaik-master-functionaltests/api/json?tree=allBuilds[*,subBuilds[*]]{" +
                paramSkip + "," + paramNumBuildsTotal + "}&depth=1",
    get(url);
}

function main (data){
    var rawRawData = data;
    var rawData = rawRawData;
    
    // API output for debug (also code in index.html)
    // $("#containerRaw").text(JSON.stringify(rawData, null, 4));
    // $("#buttonRaw").click(function() {
    //	    $("#containerRaw").toggle();
    // });

    var table = document.getElementById('table');
    var tableRow = table.insertRow(0);
    var tableCell = tableRow.insertCell(0);
    tableCell.innerHTML = "TC Build";
    tableRow = table.insertRow(1);
    tableCell = tableRow.insertCell(0);
    tableCell.innerHTML = "Duration";
    tableRow = table.insertRow(2);
    tableCell = tableRow.insertCell(0);
    tableCell.innerHTML = "Timestamp";
 

    for (var j = 0; j < rawData.allBuilds.length; j++) {
    	buildData = rawData.allBuilds[j];
        var cell = table.rows[0].insertCell(-1);
        cell.innerHTML = "<a href='" + buildData.url + "'>" + buildData.displayName + "</a>";
        if (paramNumBuilds <= 25) {
               cell.innerHTML = cell.innerHTML.concat("<a class=buildserverlink id=" + buildData.displayName +" onclick='buildServerColumn(this.parentNode.cellIndex)'><img src='img/letter_s.png' /></a>");
            }
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
        cell = table.rows[1].insertCell(-1);
        dur = new Date(buildData.duration);
        if (buildData.building) {
            cell.innerHTML = "building";
        } else {
            var durString = dur.getMinutes() + ":" + ("00" + dur.getSeconds()).substr(-2,2) + "." + dur.getMilliseconds()
            if (paramNumBuilds <= 25) {
                cell.innerHTML = durString;
            } else {
                cell.innerHTML = '*';
                cell.className = 'ellipsis';
                cell.title = durString;
            }
        }
        
        cell = table.rows[2].insertCell(-1);
        var dateString = new Date(buildData.timestamp).toString().split(" ")[4];
        if (paramNumBuilds <= 25) {
            cell.innerHTML = dateString;
        } else {
            cell.innerHTML = '*';
            cell.className = 'ellipsis';
            cell.title = dateString;
        }
        
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
                url = baseUrl + subBuildData.url + "TestComplete/",
                buildNumber = subBuildData.buildNumber;
            
            if (!document.getElementById(jobName)) {
                var row = table.insertRow(-1);
                row.setAttribute('id',jobName);
                // $("#table").append("<tr id=" + jobName + ">");
                cell = row.insertCell(0);
                cell.innerHTML = '<a href="' + baseUrl + 'job/' + jobName + '">' + jobName + '</a>';
                
                // $("#table").append("   <td> " + jobName + " </td>");
                if (paramNumBuilds <= 25) {
                    cell.innerHTML = cell.innerHTML.concat("<a class=buildserverlink id=" + jobName +" onclick='buildServerRow(this.parentNode.parentNode)'><img src='img/letter_s.png' /></a>");
                }
                for(var k = table.childNodes[0].cells.length - 2; k > 0; k--) {
                    cell = row.insertCell(1);
                    cell.setAttribute('class',"pending");
                    cell.innerHTML = "n/a";
                }
                cell = row.insertCell(-1);
                cell.setAttribute('class',tdclass);
                cell.innerHTML = "<a href='" + url + "'>" + buildNumber + "</a>";
            } else {
                var row = document.getElementById(jobName);
                cell = row.insertCell(-1);
                cell.setAttribute('class',tdclass);
                cell.innerHTML = "<a href='" + url + "'>" + buildNumber + "</a>";
            }
            // cell.setAttribute('class',tdclass);
            // cell.innerHTML = "<a href='" + url + "'>" + buildNumber + "</a>";
            
            
            cell.innerHTML = cell.innerHTML.concat("<a class=buildserverlink id=" + subBuildData.url +" onclick='buildServerCell(this)'></a>");
            
        }
        
        for (l = 0; l < table.children.length ; l++) {
            var row = table.children[l];
            if (row.children.length  < table.children[0].children.length) {
                cell = row.insertCell(-1);
                cell.setAttribute('class',"pending");
                cell.innerHTML = "n/a";
            }
        }   
    }
};

function buildServerCell(elem) {
    if (elem !== undefined) {
        url = baseUrl + elem.id;
        
        $.ajax({
            url: url + "api/json?tree=builtOn,keepLog",
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + token);
            }
        })
        .done(function(data) { // console.log("Data: " + data); console.log(data)
            var subBuildServerJSON = data;
            var subBuildServer = subBuildServerJSON.builtOn;
            var subBuildServerNum = subBuildServer.replace("testcomplete","");
            elem.setAttribute('href','https://creatorci.eu.zmags.com/computer/testcomplete' + subBuildServerNum + '/');
            elem.innerHTML = subBuildServerNum;
            var keeping;
            if (subBuildServerJSON.keepLog == true) {
                keeping = "keep";
            } else {
                keeping = "not_keep"
            }
            elem.parentNode.classList.add(keeping);
        });
    }
}

function buildServerColumn(col) {
    var table = document.getElementById('table');
    //var col = table.rows[0].cells;
    for (var i=3; i < table.rows.length; i++) {
        buildServerCell(table.rows[i].cells[col].getElementsByClassName('buildserverlink')[0]);
    }
    // remove s from top
}

function buildServerRow(row) {
    var table = document.getElementById('table');
    for (var i=1; i < row.cells.length; i++) {
        buildServerCell(row.cells[i].getElementsByClassName('buildserverlink')[0]);
    }
}
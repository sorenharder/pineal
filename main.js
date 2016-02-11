// online data

function get(url) {
    // var out;
    $.ajax({
        url: url,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + token);
            xhr.setRequestHeader("Accept-Language", "en-US,en;q=0.5");
        }
    })
    .done(main);
}

// offline & online

var // rawRawData = $.getJSON('TCexample.json'), //offline
    baseUrl = "https://creatorci.eu.zmags.com/",
    paramSkip = 0,
    paramNumBuilds = 24,
    // url = "https://creatorci.eu.zmags.com/job/mosaik-master-functionaltests/135/api/json?tree=*,subBuilds[*]&depth=1",
    // url = "https://creatorci.eu.zmags.com/job/mosaik-master-functionaltests/api/json?tree=allBuilds[*,subBuilds[*]]{0,20}&depth=1",
    // to get build (master/branch): https://creatorci.eu.zmags.com/job/mosaik-master-functionaltests/api/json?tree=allBuilds[actions[parameters[*]]]{21,22}&depth=1&pretty
    url = "https://creatorci.eu.zmags.com/job/mosaik-master-functionaltests/api/json?tree=allBuilds[*,subBuilds[*],actions[parameters[*],causes[*]]]{" +
                paramSkip + "," + paramNumBuilds + "}&depth=1",
    token = "cG9oOjhhYWUwNTc3MTQ4NzI0ZGMwZjBlYTdmNTE3MjU5YzMy";

    get(url);
    
function reload(url) {
    document.getElementById('table').innerHTML = '';
    paramSkip = parseInt(document.getElementById('skip').value,10);
    paramNumBuilds = parseInt(document.getElementById('num_builds',10).value);
    paramNumBuildsTotal = paramSkip +  paramNumBuilds;
    url = "https://creatorci.eu.zmags.com/job/mosaik-master-functionaltests/api/json?tree=allBuilds[*,subBuilds[*],actions[parameters[*],causes[*]]]{" +
                paramSkip + "," + paramNumBuildsTotal + "}&depth=1",
    get(url);
}
    
var errorH1 = document.createElement("H1");
errorH1.innerHTML = "Errors";
var errorTable = document.createElement("table");
errorTable.setAttribute('id','errortest');
//var successH1 = document.createElement("H1");
//successH1.innerHTML = "Successes";
//var successTable = document.createElement("table");
//successTable.setAttribute('id','successtest');
var errorRow;

function review() {
    var cellNo;
    var errorCell;
    var table = document.getElementById('table');
   
    var reviewCont = document.getElementById('review');
    reviewCont.innerHTML = "";
    errorTable.innerHTML = "";
    // successTable.innerHTML = "";
    
    var reviewArrayChecked = document.querySelectorAll('.review:checked');
    if (reviewArrayChecked.length > 0) {
        reviewCont.appendChild(errorH1);
        reviewCont.appendChild(errorTable);
        // reviewCont.appendChild(successH1);
        // reviewCont.appendChild(successTable);
        
        var errorHeader = errorTable.createTHead();
        var errorHRow = errorHeader.insertRow(0);
        for(i = 0; i < 9; i++) {
            errorHRow.insertCell(i);
        }
        errorHRow.cells[0].innerHTML = "branch";
        errorHRow.cells[1].innerHTML = "date";
        errorHRow.cells[2].innerHTML = "starter";
        errorHRow.cells[3].innerHTML = "startId";
        errorHRow.cells[4].innerHTML = "multiId";
        errorHRow.cells[5].innerHTML = "test";
        errorHRow.cells[6].innerHTML = "testId";
        errorHRow.cells[7].innerHTML = "server";
        errorHRow.cells[8].innerHTML = "toggle";
        
        var errorTableB = document.createElement("tbody");
        errorTable.appendChild(errorTableB);
        
        
        //reviewCont.innerHTML = "<h1>Error</h1><table id='errortest' /><h1>Success</h1><table  id='successtest' />";
        for (i = 0; i < reviewArrayChecked.length; i++){
            
            var failure = false;
            for (var j=6; j < table.rows.length; j++) {
                //errorCell = errorRow.insertCell(0);
                //errorCell.innerHTML =  reviewArrayChecked[i].value;errorCell = errorRow.insertCell(-1);
                cellNo = reviewArrayChecked[i].parentNode.cellIndex;
                cell = table.rows[j].cells[cellNo];
                if (cell.className.includes("fail")) {
                    failure = true;
                    url = baseUrl + cell.lastChild.id;
                    
                    makeErrorRow(errorTableB, table, cellNo, j);
                    
                    /*
                    var errorRow = errorTableB.insertRow(0);
                    errorRow.setAttribute("class", "fail");
                    var eCellBuild = errorRow.insertCell(0);
                    var eCellTime = errorRow.insertCell(1)
                    var eCellStarter = errorRow.insertCell(2);
                    var eCellStId = errorRow.insertCell(3);
                    var eCellMBuild = errorRow.insertCell(4);
                    var eCellTest = errorRow.insertCell(5);
                    var eCellTId = errorRow.insertCell(6);
                    var eCellBServ = errorRow.insertCell(7);
    
                    getAjaxData(errorRow); 
                    
                    eCellBuild.innerHTML = "master";                    
                    if (table.rows[4].cells[cellNo].firstChild.id == "upstream_build") {
                            eCellStarter.innerHTML = "SCM";
                            eCellStId.innerHTML = table.rows[4].cells[cellNo].innerText;
                    } else {
                            eCellStarter.innerHTML = table.rows[4].cells[cellNo].innerText;
                            eCellStId.innerHTML = "";
                    }
                    
                    eCellMBuild.innerHTML = (table.rows[0].cells[cellNo].innerText).substring(1);
                    
                    eCellTest.innerHTML = (table.rows[j].id).substring(10);
                    
                    eCellTId.innerHTML = table.rows[j].cells[cellNo].innerHTML;
                    */
                }                
            }
            
            if (!failure) {
                console.log("do not fail");
                errorRow = makeErrorRow(errorTableB, table, cellNo, -1);
                errorRow.setAttribute("class", "success");
            }
            failure = false;
        }
    }
    
}

function makeErrorRow(errorTableB, table, cellNo, testId) {
    var err_b;
    if (testId == -1) {
        err_b = false;
    } else {
        err_b = true;
    }
    var errorRow = errorTableB.insertRow(0);
    if (err_b) {
        errorRow.setAttribute("class", "fail");
    }

    var eCellBuild = errorRow.insertCell(0);
    var eCellTime = errorRow.insertCell(1)
    var eCellStarter = errorRow.insertCell(2);
    var eCellStId = errorRow.insertCell(3);
    var eCellMBuild = errorRow.insertCell(4);
    var eCellTest = errorRow.insertCell(5);
    var eCellTId = errorRow.insertCell(6);
    var eCellBServ = errorRow.insertCell(7);
    var eCellTgl = errorRow.insertCell(8);

    if (err_b) {
        getAjaxData(errorRow); 
    }
                
    eCellBuild.innerHTML = table.rows[3].cells[cellNo].textContent;
    if (table.rows[4].cells[cellNo].firstChild.id == "upstream_build") {
        eCellStarter.innerHTML = "SCM"; //not always right: use https://creatorci.eu.zmags.com/job/mosaik-master-mb/3749/api/json?tree=actions[causes[userId,shortDescription]]&pretty
        eCellStId.innerHTML = table.rows[4].cells[cellNo].textContent;
    } else {
        eCellStarter.innerHTML = table.rows[4].cells[cellNo].textContent;
        eCellStId.innerHTML = "";
    }
    
    eCellMBuild.innerHTML = (table.rows[0].cells[cellNo].textContent).substring(1);

    if (err_b) {
        eCellTest.innerHTML = (table.rows[testId].id).substring(10);            
        eCellTId.innerHTML = table.rows[testId].cells[cellNo].childNodes[0].outerHTML;
        //buildServerCell(table.rows[testId].cells[cellNo].childNodes[1]);
        buildServerCell(table.rows[testId].cells[cellNo].getElementsByClassName("buildserverlink")[0])
        var keepImg;
        var cn = table.rows[testId].cells[cellNo].className;
        if (cn.includes("not_keep")) {
            keepImg = "./img/red_plus.png";
        } else {
            keepImg = "./img/minus_sign.gif";
        }
        eCellTgl.innerHTML = "<img src='"+keepImg+"' />";
        
    } else {
        eCellTest.innerHTML = "All"
        eCellTId.innerHTML = ""
    }
    
    return errorRow;            
}

function deferredAjax(data, errorRow) { // console.log("Data: " + data); console.log(data)
                        var subBuildServerJSON = data;
                        date = new Date(data.reports[0].details.timestamp);
                        errorRow.cells[1].innerHTML = date.toLocaleDateString("en-US", {month: 'short', day: 'numeric', year: 'numeric'}) + " " + date.toLocaleTimeString("en-US");
                        
                        errorRow.cells[7].innerHTML = (data.reports[0].agent).replace("testcomplete","");
                        
                        errorRow.cells[6].firstChild.setAttribute("href", data.reports[0].url);
                        errorRow.cells[6].firstChild.setAttribute("target", "_blank");
}
function getAjaxData(errorRow) {
    return  $.ajax({
                        url: url + "TestComplete/api/json?tree=*,reports[*,details[*]]",
                        dataType: "json",
                        row: errorRow,
                        success: function(data) { deferredAjax(data,this.row) },
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Authorization", "Basic " + token);
                            xhr.setRequestHeader("Accept-Language", "en-US,en;q=0.5");
                        }
                        
                    })
}

function main (data){
    var rawRawData = data;
    var rawData = rawRawData;
    
    // API output for debug (also code in index.html)
    // $("#containerRaw").text(JSON.stringify(rawData, null, 4));
    // $("#buttonRaw").click(function() {
    //	    $("#containerRaw").toggle();
    // });

    // set table header
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
    
    tableRow = table.insertRow(3);
    tableCell = tableRow.insertCell(0);
    tableCell.innerHTML = "Branch";
    
    tableRow = table.insertRow(4);
    tableCell = tableRow.insertCell(0);
    tableCell.innerHTML = "Started by";
    
    tableRow = table.insertRow(5);
    tableCell = tableRow.insertCell(0);
    tableCell.innerHTML = "Review";
    
    
 
    // iterate over builds
    for (var j = 0; j < rawData.allBuilds.length; j++) {
    	buildData = rawData.allBuilds[j];
        
        ///////////////////////////////////
        // row 0: build number
        
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
        
        ///////////////////////////////////
        // row 1: duration
        
        cell = table.rows[1].insertCell(-1);
        dur = new Date(buildData.duration);
        if (buildData.building) {
            cell.innerHTML = "building";
        } else {
            //var durStringMin = dur.getMinutes() + dur.getHours() * 60;
            var durString = (dur.getHours()+(dur.getTimezoneOffset()/60)) + ":" + ("00" + dur.getMinutes()).substr(-2,2) + ":" + ("00" + dur.getSeconds()).substr(-2,2);
            if (paramNumBuilds <= 25) {
                cell.innerHTML = durString;
            } else {
                cell.innerHTML = '*';
                cell.className = 'ellipsis';
                cell.title = durString;
            }
        }
        
        ///////////////////////////////////
        // row 2: timestamp
        
        cell = table.rows[2].insertCell(-1);
        cell.title = new Date(buildData.timestamp);
        var dateString = new Date(buildData.timestamp).toString().split(" ")[4];
        if (paramNumBuilds <= 25) {
            cell.innerHTML = dateString;
        } else {
            cell.innerHTML = '*';
            cell.className = 'ellipsis';
        }
        
        ///////////////////////////////////
        // row 3: branch built
        
        cell = table.rows[3].insertCell(-1);
        
        // find the unique branchString: buildData.actions[x].parameters[x] = {name="BUILD", value=branchString}, default to '<i>default</i>'
        var branchString = 'noBranch';
        var actions = buildData.actions;
        var parameters = [];
        
        /*
         * alternative solution for code below
        for (var i = 0; i < actions.length; i++) {
            if (actions[i].parameters) {
                parameters = actions[i].parameters;
                break;
            }
        }
         for (var i = 0; i < parameters.length; i++) {
            if (parameters[i].name === "BUILD") {
                branchString = parameters[i].value;
                break;
            }
        }
        */
        
        parameters = actions.reduce(function(result, a) {
            return a.parameters ? a.parameters : result;
        }, null);
        
        branchString = parameters.reduce(function (result, p) {
            return p.name === "BUILD" ? p.value : result;
        }, null);
        
        if (branchString === ''){
            branchString = 'Akamai' ;
        }
        
        if (paramNumBuilds <= 25) {
            cell.innerHTML = branchString;
        } else {
            cell.innerHTML = (branchString=='Akamai')?'A':'*';
            cell.className = 'ellipsis';
            cell.title = branchString;
        }

        ///////////////////////////////////
        // row 4: started by
        
        cell = table.rows[4].insertCell(-1);
        // find the unique causes: buildData.actions[x].causes[x] = {shortDescription="Started by .*"}
        /*var causes = buildData.actions.reduce(function (result, c) {
            if (c.causes) {
                result.push(c.causes)
                //code
            }
            return c.causes ? result.push(c.causes) : result;
        }, []); 
        */
        
        var causes = buildData.actions.reduce(function (array, action) {
            if (action.causes) {
                array.push(action.causes[0]);
            }
            
            return array;
        }, []);
        
        /*
        var causes = buildData.actions.filter(function(action){
            return action.causes; 
        });
        */
        
        var startedByJSON = causes.find(function (cause) {         
            return cause.shortDescription && cause.shortDescription.indexOf("Started by") > -1;
        });
        
        startedByCellTitle = '';
        if (startedByJSON.shortDescription === "Started by timer") {
            startedBy = "timer";
        } else if (startedByJSON.shortDescription.indexOf("Started by user") === 0) {
            startedBy = startedByJSON.userId;
       } else if (startedByJSON.shortDescription.search("Started by upstream project \"mosaik-master-mb\"") == 0){
            startedBy = "<a href=\"" + baseUrl + startedByJSON.upstreamUrl + startedByJSON.upstreamBuild +"\" id='upstream_build'>" + startedByJSON.upstreamBuild + "</a>";
            startedByCellTitle = startedByJSON.upstreamBuild;
        } else {
            startedBy = "???";
        }
        
        if (paramNumBuilds <= 25) {
            cell.innerHTML = startedBy;
        } else {
            if (startedBy == 'timer') {
                cell.innerHTML = 'T';
            } else {
                cell.innerHTML = startedBy;
            }
            cell.className = 'ellipsis';
            cell.title = (startedByCellTitle != '')?startedByCellTitle:startedBy;
        }
        ///////////////////////////////////
        // row 5: select for review
        
        cell = table.rows[5].insertCell(-1);
        cell.innerHTML = "<input type='checkbox' name='review' class='review' onclick='review();' value=" + buildData.displayName + ">";
        if (paramNumBuilds > 25){
            cell.className = 'ellipsis';
        }
        
        ///////////////////////////////////
        // row n: subtests
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
//                cell = row.insertCell(-1);
//                cell.setAttribute('class',tdclass);
//                cell.innerHTML = "<a href='" + url + "' target='_blank'>" + buildNumber + "</a>";
            } else {
                var row = document.getElementById(jobName);
//                cell = row.insertCell(-1);
//                cell.setAttribute('class',tdclass);
//                cell.innerHTML = "<a href='" + url + "' target='_blank'>" + buildNumber + "</a>";
            }
            cell = row.insertCell(-1);
            cell.setAttribute('class',tdclass);
            cell.innerHTML = "<a href='" + url + "' target='_blank'>" + buildNumber + "</a>";
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
                xhr.setRequestHeader("Accept-Language", "en-US,en;q=0.5");
            }
        })
        .done(function(data) { // console.log("Data: " + data); console.log(data)
            var subBuildServerJSON = data;
            var subBuildServer = subBuildServerJSON.builtOn;
            var subBuildServerNum = subBuildServer.replace("testcomplete","");
            elem.setAttribute('href','https://creatorci.eu.zmags.com/computer/testcomplete' + subBuildServerNum + '/');
            elem.setAttribute('target','_blank');
            elem.innerHTML = subBuildServerNum;
            var keeping;
            if (subBuildServerJSON.keepLog == true) {
                keeping = "keep";
            } else {
                keeping = "not_keep"
            }
            elem.parentNode.classList.remove("keep","not_keep");
            elem.parentNode.classList.add(keeping);
        });
    }
}

function buildServerColumn(col) {
    var table = document.getElementById('table');
    //var col = table.rows[0].cells;
    for (var i=6; i < table.rows.length; i++) {
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
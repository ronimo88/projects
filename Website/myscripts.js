
let entries = [];
let sports = [];
let teams = [];
let leagues = [];
let conferences = [];
let divisions = [];
let locations = [];
let minYear = "1919";
let maxYear = "2022";
let startYear = minYear;
let endYear = maxYear;
let testValue = "none";
let sportCheckboxes = "";
let leagueCheckboxes = "";
let conferenceCheckboxes = "";
let divisionCheckboxes = "";
let locationCheckboxes = "";
let teamCheckboxes = "";
let sliderDistance = 0;
let dataLoading = 0;


let isMouseHover = false



//Runs at the start of the program. 
function startScript() {
	//Sets year sliders start and end values
	document.getElementById("startYearSlider").min = parseFloat(minYear);
	document.getElementById("startYearSlider").max = parseFloat(maxYear);
	document.getElementById("startYearSlider").value = parseFloat(minYear);
	
	document.getElementById("endYearSlider").min = parseFloat(minYear);
	document.getElementById("endYearSlider").max = parseFloat(maxYear);
	document.getElementById("endYearSlider").value = parseFloat(maxYear);

	startYear = document.getElementById("startYearSlider").value;
	document.getElementById("startYearSliderText").innerHTML = "Start Year: " + startYear;
	
	endYear = document.getElementById("endYearSlider").value;
	document.getElementById("endYearSliderText").innerHTML = "End Year: " + endYear;
	
	getFiles(); 
	checkCookie();
}


//Gets data from Excel files
function getFiles() {

	addSport("Football", 32);
	addSport("Basketball", 30);
	//addSport("Baseball", 30);
	//addSport("Hockey", 30);
	
}

//Adds a sport and gets its files
function addSport(sport, numFiles) {
	sports[sports.length] = sport;
	dataLoading += numFiles;
	for (let i=1; i<=numFiles; i++) {
		
		let num = "0";
		if (i<10) num += "0"
		let file = "sheet" + num + i;
		getTable("data/" + sport +"_files/" + file + ".htm", sport);
	}
	
}

//Gets the table from from the Excel file
function getTable(file, sport) {
	
	let txt = "";
	let xhttp;

	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		
		
		if (this.readyState == 4) {
			
			
			if (this.status == 200) {
				txt = this.responseText;  
			
				document.getElementById("mydiv").innerHTML = txt;
				let oTable = document.getElementById("mydiv").getElementsByTagName("table")[0];
				loadData(oTable, sport);
				
			}

			if (this.status == 404) {
				txt = "Page not found"
				
				dataLoading--;
	
				if (dataLoading == 0) {
					createFilters();
					showResults();
				}
			}		
		}	
	}		
	
	xhttp.open("GET", file, true);
	xhttp.send();
	
	return;

};

//Loads cell values from the table and adds teams and entries
function loadData(oTable, sport) {
	
	var rowLength = oTable.rows.length;
	
	let teamName = "";
	
	for (let i=1; i<rowLength; i++) {
		var n = oTable.rows.item(rowLength-i).cells.item(1).innerHTML;
		if (n != "") {
			teamName = n;
			break;
		}
	}
	
	//adds a team
	teams[teams.length] = {
		teamName: teamName,
		loc: "",
		name: "",
		totalWins: 0,
		totalLosses: 0,
		totalTies: 0,
		winPercentage: 0,
		color: ""
	}
	

	//Loops through each row and gets cell values
	for (i = 1; i < rowLength; i++) {
	
		var oCells = oTable.rows.item(i).cells;

		var loc = oCells.item(0).innerHTML;
		var name = oCells.item(1).innerHTML;
		var year = oCells.item(2).innerHTML;
		var league = oCells.item(3).innerHTML;
		var conference = oCells.item(4).innerHTML;
		var division = oCells.item(5).innerHTML;
		var winsText = oCells.item(6).innerHTML;
		var lossesText = oCells.item(7).innerHTML;
		var tiesText = oCells.item(8).innerHTML;
		var color = "";
		if (oCells.length >= 10) color = oCells.item(9).innerHTML;
		
		//00F3

		if (league=="\uFFFD") league="\u2014";
		if (conference=="\uFFFD") conference="\u2014";
		if (division=="\uFFFD") division="\u2014";
		if (loc=="\uFFFD") loc="\u2014";
		
		if (winsText == "") winsText = "0";
		if (lossesText == "") lossesText = "0";
		if (tiesText == "") tiesText = "0";
	
		if (!leagues.includes(league) && league != "") leagues[leagues.length] = league;
		if (!conferences.includes(conference) && conference != "") conferences[conferences.length] = conference;
		if (!divisions.includes(division) && division != "") divisions[divisions.length] = division;
		if (!locations.includes(loc) && loc != "") locations[locations.length] = loc;
		
		
		if (winsText != "") {
			var wins = parseFloat(winsText);
		}
		
		if (lossesText != "") {
			var losses = parseFloat(lossesText);
		}
		
		if (tiesText != "") {
			var ties = parseFloat(tiesText);
			
		}
		
		//Adds the entry
		if (wins+losses+ties > 0) {
			entries[entries.length] = {
				teamName: teamName, 	
				loc: loc, 
				name: name, 
				year: year,
				sport: sport,
				league: league,
				conference: conference,
				division: division,
				wins: wins, 
				losses: losses, 
				ties: ties,
				color: color
			}	

		}

	}
	
	
	dataLoading--;
	
	//Creates filters and shows the results if there is no more data to load. 
	if (dataLoading == 0) {
		createFilters();
		showResults();
	}	
}

//Creates the filtering checkboxes
function createFilters() {
	
	//Sorts the checkboxes by alphabetical order.
	sports.sort();
	leagues.sort();
	conferences.sort();
	divisions.sort();
	locations.sort();

	teams.sort(function (a,b) {
		if (a.teamName < b.teamName) {
			return -1;
		}
		if (a.teamName > b.teamName) {
			return 1;
		}
		return 0;
	});
	
	
	document.getElementById("sportBox").innerHTML = "";
	document.getElementById("leagueBox").innerHTML = "";
	document.getElementById("conferenceBox").innerHTML = "";
	document.getElementById("divisionBox").innerHTML = "";
	document.getElementById("locationBox").innerHTML = "";
	document.getElementById("teamBox").innerHTML = "";
	document.getElementById("resultsTable").innerHTML = "";
	
	document.getElementById("sportBox").innerHTML += "<input type='checkbox' class='checkboxSports' onclick='allButtonClicked(0)' checked=true id='checkboxSportsAll' name='checkboxSportsAll' value='All'>";
	document.getElementById("sportBox").innerHTML += "<label for='checkboxSportsAll'>" + "ALL" + "</label><br>";
	
	document.getElementById("leagueBox").innerHTML += "<input type='checkbox' class='checkboxLeagues'onclick='allButtonClicked(1)' checked=true id='checkboxLeaguesAll' name='checkboxLeaguesAll' value='All'>";
	document.getElementById("leagueBox").innerHTML += "<label for='checkboxLeaguesAll'>" + "ALL" + "</label><br>";
	
	document.getElementById("conferenceBox").innerHTML += "<input type='checkbox' class='checkboxConferences' onclick='allButtonClicked(2)' checked=true id='checkboxConferencesAll' name='checkboxConferencesAll' value='All'>";
	document.getElementById("conferenceBox").innerHTML += "<label for='checkboxConferencesAll'>" + "ALL" + "</label><br>";
	
	document.getElementById("divisionBox").innerHTML += "<input type='checkbox' class='checkboxDivisions' onclick='allButtonClicked(3)' checked=true id='checkboxDivisionsAll' name='checkboxDivisionsAll' value='All'>";
	document.getElementById("divisionBox").innerHTML += "<label for='checkboxDivisionsAll'>" + "ALL" + "</label><br>";
	
	document.getElementById("locationBox").innerHTML += "<input type='checkbox' class='checkboxLocations' onclick='allButtonClicked(4)' checked=true id='checkboxLocationsAll' name='checkboxLocationsAll' value='All'>";
	document.getElementById("locationBox").innerHTML += "<label for='checkboxLocationsAll'>" + "ALL" + "</label><br>";
	
	document.getElementById("teamBox").innerHTML += "<input type='checkbox' class='checkboxTeams' onclick='allButtonClicked(5)' checked=true id='checkboxTeamsAll' name='checkboxTeamsAll' value='All'>";
	document.getElementById("teamBox").innerHTML += "<label for='checkboxTeamsAll'>" + "ALL" + "</label><br>";
	
	
		
	
	for (let i=0; i<sports.length; i++) {
		document.getElementById("sportBox").innerHTML += "<input type='checkbox' class='checkboxSports' onclick='showResults()' checked=true id='checkbox_sports_" + 
		sports[i] + "' name='checkbox_" + sports[i] + "' value='" + sports[i] + "'>";
		document.getElementById("sportBox").innerHTML += "<label id='label_sports_"  + sports[i] + "'>" + sports[i] + 
		"</label><br id='break_sports_" + sports[i] + "'> ";
	}
	
	for (let i=0; i<leagues.length; i++) {
		document.getElementById("leagueBox").innerHTML += "<input type='checkbox' class='checkboxLeagues' onclick='showResults()' checked=true id='checkbox_leagues_" + 
		leagues[i] + "' name='checkbox_" + leagues[i] + "' value='" + leagues[i] + "'>";
		document.getElementById("leagueBox").innerHTML += "<label id='label_leagues_"  + leagues[i] + "'>" + leagues[i] + 
		"</label><br id='break_leagues_" + leagues[i] + "'> ";
	}
	
	for (let i=0; i<conferences.length; i++) {
		document.getElementById("conferenceBox").innerHTML += "<input type='checkbox' class='checkboxConferences' onclick='showResults()' checked=true id='checkbox_conferences_" + 
		conferences[i] + "' name='checkbox_" + conferences[i] + "' value='" + conferences[i] + "'>";
		document.getElementById("conferenceBox").innerHTML += "<label id='label_conferences_"  + conferences[i] + "'>" + conferences[i] + 
		"</label><br id='break_conferences_" + conferences[i] + "'> ";
	}
	
	for (let i=0; i<divisions.length; i++) {
		document.getElementById("divisionBox").innerHTML += "<input type='checkbox' class='checkboxDivisions' onclick='showResults()' checked=true id='checkbox_divisions_" + 
		divisions[i] + "' name='checkbox_" + divisions[i] + "' value='" + divisions[i] + "'>";
		document.getElementById("divisionBox").innerHTML += "<label id='label_divisions_" + divisions[i] + "'>" + divisions[i] + 
		"</label><br id='break_divisions_" + divisions[i] + "'> ";
	}
	
	for (let i=0; i<locations.length; i++) {
		document.getElementById("locationBox").innerHTML += "<input type='checkbox' class='checkboxLocations' onclick='showResults()' checked=true id='checkbox_locations_" + 
		locations[i] + "' name='checkbox_" + locations[i] + "' value='" + locations[i] + "'>";
		document.getElementById("locationBox").innerHTML += "<label id='label_locations_" + locations[i] + "'>" + locations[i] + 
		"</label><br id='break_locations_" + locations[i] + "'> ";
	}
	
	
	for (let i=0; i<teams.length; i++) {
		document.getElementById("teamBox").innerHTML += "<input type='checkbox' class='checkboxTeams' onclick='showResults()' checked=true id='checkbox_teams_" + 
		teams[i].teamName + "' name='checkbox_" + teams[i].teamName + "' value='" + teams[i].teamName + "'>";
		document.getElementById("teamBox").innerHTML += "<label id='label_teams_" + teams[i].teamName + "'>" + teams[i].teamName + 
		"</label><br id='break_teams_" + teams[i].teamName + "'> ";
	}

	
	
	


	sportCheckboxes = document.getElementById("sportBox").getElementsByClassName("checkboxSports");
	leagueCheckboxes = document.getElementById("leagueBox").getElementsByClassName("checkboxLeagues");
	conferenceCheckboxes = document.getElementById("conferenceBox").getElementsByClassName("checkboxConferences");
	divisionCheckboxes = document.getElementById("divisionBox").getElementsByClassName("checkboxDivisions");
	locationCheckboxes = document.getElementById("locationBox").getElementsByClassName("checkboxLocations");
	teamCheckboxes = document.getElementById("teamBox").getElementsByClassName("checkboxTeams");
	
}

function allButtonClicked(val) {
	
	if (val==0) {
		for (let i=0; i<sportCheckboxes.length; i++) {
			sportCheckboxes[i].checked = sportCheckboxes[0].checked;
		}
	}
	
	if (val==1) {
		for (let i=0; i<leagueCheckboxes.length; i++) {
			leagueCheckboxes[i].checked = leagueCheckboxes[0].checked;
		}
	}
	
	if (val==2) {
		for (let i=0; i<conferenceCheckboxes.length; i++) {
			conferenceCheckboxes[i].checked = conferenceCheckboxes[0].checked;
		}
	}
	
	if (val==3) {
		for (let i=0; i<divisionCheckboxes.length; i++) {
			divisionCheckboxes[i].checked = divisionCheckboxes[0].checked;
		}
	}
	
	
	if (val==4) {
		for (let i=0; i<locationCheckboxes.length; i++) {
			locationCheckboxes[i].checked = locationCheckboxes[0].checked;
		}
	}
	
	
	if (val==5) {
		for (let i=0; i<teamCheckboxes.length; i++) {
			teamCheckboxes[i].checked = teamCheckboxes[0].checked;
		}
	}
	
	showResults();
}

	

function showResults() {

	
	testValue = divisions.length;
	

	for (let i=0; i<leagues.length; i++) {
		document.getElementById("checkbox_leagues_" + leagues[i]).style.display = "none";
		document.getElementById("label_leagues_" + leagues[i]).style.display = "none";
		document.getElementById("break_leagues_" + leagues[i]).style.display = "none";
	}

	for (let i=0; i<conferences.length; i++) {
		document.getElementById("checkbox_conferences_" + conferences[i]).style.display = "none";
		document.getElementById("label_conferences_" + conferences[i]).style.display = "none";
		document.getElementById("break_conferences_" + conferences[i]).style.display = "none";
	}

	for (let i=0; i<divisions.length; i++) {
		document.getElementById("checkbox_divisions_" + divisions[i]).style.display = "none";
		document.getElementById("label_divisions_" + divisions[i]).style.display = "none";
		document.getElementById("break_divisions_" + divisions[i]).style.display = "none";
	}


	for (let i=0; i<locations.length; i++) {
		document.getElementById("checkbox_locations_" + locations[i]).style.display = "none";
		document.getElementById("label_locations_" + locations[i]).style.display = "none";
		document.getElementById("break_locations_" + locations[i]).style.display = "none";
	}


	for (let i=0; i<teams.length; i++) {
		document.getElementById("checkbox_teams_" + teams[i].teamName).style.display = "none";
		document.getElementById("label_teams_" + teams[i].teamName).style.display = "none";
		document.getElementById("break_teams_" + teams[i].teamName).style.display = "none";
	}
	

	document.getElementById("resultsTable").innerHTML = "";
	
	for (let i=0; i<teams.length; i++) {
		teams[i].totalWins = 0;
		teams[i].totalLosses = 0;
		teams[i].totalTies = 0;
	}
	
	let i = -1;
	
	for (let j=0; j<entries.length; j++) {
		if (entries[j].year >= startYear && entries[j].year <= endYear ) {
			
			let sportCheckbox = null;
			let leagueCheckbox = null;
			let conferenceCheckbox = null;
			let divisionCheckbox = null;
			let locationCheckbox = null;
			let teamCheckbox = null;

			
			for(let i=0; i<sportCheckboxes.length; i++) {
				
				if (entries[j].sport == sportCheckboxes[i].value) {

					sportCheckbox = sportCheckboxes[i];
				}
			}
			
			for(let i=0; i<leagueCheckboxes.length; i++) {
				
				if (entries[j].league == leagueCheckboxes[i].value) {

					leagueCheckbox = leagueCheckboxes[i];
				}
			}
			
			for(let i=0; i<conferenceCheckboxes.length; i++) {
				
				if (entries[j].conference == conferenceCheckboxes[i].value) {

					conferenceCheckbox = conferenceCheckboxes[i];
				}
			}
			
			for(let i=0; i<divisionCheckboxes.length; i++) {
				
				if (entries[j].division == divisionCheckboxes[i].value) {

					divisionCheckbox = divisionCheckboxes[i];
				}
			}
			
			for(let i=0; i<locationCheckboxes.length; i++) {
				
				if (entries[j].loc == locationCheckboxes[i].value) {

					locationCheckbox = locationCheckboxes[i];
				}
			}
			
			for(let i=0; i<teamCheckboxes.length; i++) {
				
				if (entries[j].teamName == teamCheckboxes[i].value) {

					teamCheckbox = teamCheckboxes[i];
				}
			}
		
			
			if (sportCheckbox != null) if (sportCheckbox.checked) {
				if (leagueCheckbox != null) {
					
					let val = leagueCheckbox.value;
					leagueCheckbox.style.display = "";
					document.getElementById("label_leagues_" + val).style.display = "";
					document.getElementById("break_leagues_" + val).style.display = "";
				}
				
			}
			
			if (leagueCheckbox != null) if (leagueCheckbox.checked && leagueCheckbox.style.display != "none" 
			&& sportCheckbox.checked && sportCheckbox.style.display != "none") {
				if (conferenceCheckbox != null) {
					
					let val = conferenceCheckbox.value;
					conferenceCheckbox.style.display = "";
					document.getElementById("label_conferences_" + val).style.display = "";
					document.getElementById("break_conferences_" + val).style.display = "";
				}
				
			}
			
			if (conferenceCheckbox != null) if (conferenceCheckbox.checked && conferenceCheckbox.style.display != "none" && leagueCheckbox.checked && leagueCheckbox.style.display != "none" 
			&& sportCheckbox.checked && sportCheckbox.style.display != "none") {
				if (divisionCheckbox != null) {
					
					let val = divisionCheckbox.value;
					divisionCheckbox.style.display = "";
					document.getElementById("label_divisions_" + val).style.display = "";
					document.getElementById("break_divisions_" + val).style.display = "";
				}
				
			}
			
			if (divisionCheckbox != null) if (divisionCheckbox.checked && divisionCheckbox.style.display != "none" && conferenceCheckbox.checked 
			&& conferenceCheckbox.style.display != "none" && leagueCheckbox.checked && leagueCheckbox.style.display != "none" 
			&& sportCheckbox.checked && sportCheckbox.style.display != "none") {
				if (locationCheckbox != null) {
					
					let val = locationCheckbox.value;
					locationCheckbox.style.display = "";
					document.getElementById("label_locations_" + val).style.display = "";
					document.getElementById("break_locations_" + val).style.display = "";
				}
				
			}
			
			if (locationCheckbox != null) if (locationCheckbox.checked && locationCheckbox.style.display != "none" && divisionCheckbox.checked && divisionCheckbox.style.display != "none" && conferenceCheckbox.checked 
			&& conferenceCheckbox.style.display != "none" && leagueCheckbox.checked && leagueCheckbox.style.display != "none" 
			&& sportCheckbox.checked && sportCheckbox.style.display != "none") {
				if (teamCheckbox != null) {
					
					let val = teamCheckbox.value;
					teamCheckbox.style.display = "";
					document.getElementById("label_teams_" + val).style.display = "";
					document.getElementById("break_teams_" + val).style.display = "";
				}
				
			}
			
			

			
			for (let i=0; i<teams.length; i++) {
				
				
				
				if (teams[i].teamName == entries[j].teamName && entries[j].year >= startYear && entries[j].year <= endYear ) {
					
					let addEntry = true;
					
					//testValue = leagueCheckboxes.length;
					
					for (let k=0; k<sportCheckboxes.length; k++) {
						if (sportCheckboxes[k].value == entries[j].sport && !sportCheckboxes[k].checked) addEntry = false;
					}
		
					for (let k=0; k<leagueCheckboxes.length; k++) {
						if (leagueCheckboxes[k].value == entries[j].league && !leagueCheckboxes[k].checked) addEntry = false;
					}
					
					for (let k=0; k<conferenceCheckboxes.length; k++) {
						if (conferenceCheckboxes[k].value == entries[j].conference && !conferenceCheckboxes[k].checked) addEntry = false;
					}
					
					for (let k=0; k<divisionCheckboxes.length; k++) {
						if (divisionCheckboxes[k].value == entries[j].division && !divisionCheckboxes[k].checked) addEntry = false;
					}
					
					for (let k=0; k<locationCheckboxes.length; k++) {
						if (locationCheckboxes[k].value == entries[j].loc && !locationCheckboxes[k].checked) addEntry = false;
					}
					
					for (let k=0; k<teamCheckboxes.length; k++) {
						if (teamCheckboxes[k].value == entries[j].teamName && !teamCheckboxes[k].checked) addEntry = false;
					}
					
					
					if (addEntry) {
						teams[i].teamName = entries[j].teamName;
						teams[i].totalWins += entries[j].wins;
						teams[i].totalLosses += entries[j].losses;
						teams[i].totalTies += entries[j].ties;
						if (entries[j].loc != "") teams[i].loc = entries[j].loc;
						if (entries[j].name != "") teams[i].name = entries[j].name;
						if (entries[j].color != "") teams[i].color = entries[j].color;
						
						
						teams[i].winPercentage = (teams[i].totalWins + teams[i].totalTies/2.0)/(teams[i].totalWins + teams[i].totalLosses + teams[i].totalTies);
					}
					
				}
			}
		}
	}
	
	

	teams.sort(function(a,b){return b.winPercentage-a.winPercentage});
	
	
	document.getElementById("resultsTable").innerHTML += "<tr><td id='resultsYears' colspan='4'  >" + startYear + "-" + endYear + "</td></tr>";
	
	document.getElementById("resultsTable").innerHTML += "<tr><th>Rank</th> <th>Team</th><th>W-L-T</th><th>Win %</th></tr>";
	
	num = 1;

	for(let i=0; i<teams.length; i++) {
		if (teams[i].totalWins + teams[i].totalLosses + teams[i].totalTies > 0) {
			
			
			document.getElementById("resultsTable").innerHTML += "<tr id='" + teams[i].teamName + "Result" + "'>" + "<td class='tdClass'>" + num + "</td><td class='tdClass'>" + teams[i].loc + "&nbsp" + teams[i].name + 
			"</td><td class='tdClass'>" + teams[i].totalWins + "-" + teams[i].totalLosses + "-" + teams[i].totalTies + "</td><td class='tdClass'>" + teams[i].winPercentage.toFixed(3) + "</tr>";
			
			
			//document.getElementById(teams[i].teamName + "Result").style.color = teams[i].color;
			
			var tds = document.getElementsByClassName("tdClass");
			
			for (let i=0; i<tds.length; i++) {
				tds[i].style = " padding-left: 10px; padding-right: 10px; padding-bottom:5px; ";
				//if (i==tds.length-1) tds[i].style = " padding-left: 10px; padding-right: 10px; padding-bottom: 10px";

			}
		
				
			num ++;
		
		}		
	}	

}

function startYearChanged() {
	
	startYear = document.getElementById("startYearSlider").value;
	
	if (startYear > endYear && !document.getElementById("sliderCheckbox").checked) {
		startYear = endYear;
		document.getElementById("startYearSlider").value = startYear;
	}
	
	if (document.getElementById("sliderCheckbox").checked) {
		endYear = parseFloat(startYear) + sliderDistance;
		
		if (endYear > maxYear) {
			endYear = maxYear;
			startYear = parseFloat(endYear) - sliderDistance;
		}
		
		document.getElementById("startYearSlider").value = startYear;
		document.getElementById("endYearSlider").value = endYear;	
	}
	
	document.getElementById("startYearSliderText").innerHTML = "Start Year: " + startYear;
	document.getElementById("endYearSliderText").innerHTML = "End Year: " + endYear;
	showResults();
}

function endYearChanged() {
	endYear = document.getElementById("endYearSlider").value;
	
	if (endYear < startYear && !document.getElementById("sliderCheckbox").checked) {
		endYear = startYear;
		document.getElementById("endYearSlider").value = endYear;
	}
	
	if (document.getElementById("sliderCheckbox").checked) {
		startYear = parseFloat(endYear) - sliderDistance;
		
		if (startYear < minYear) {
			startYear = minYear;
			endYear = parseFloat(startYear) + sliderDistance;
		}
		
		document.getElementById("startYearSlider").value = startYear;
		document.getElementById("endYearSlider").value = endYear;	
	}
	
	document.getElementById("startYearSliderText").innerHTML = "Start Year: " + startYear;
	document.getElementById("endYearSliderText").innerHTML = "End Year: " + endYear;
	showResults();
}

function sliderCheckboxClicked() {
	if (document.getElementById("sliderCheckbox").checked) {
		sliderDistance = endYear - startYear;
	} else sliderDistance = 0;
}

function changeTheme() {
	
	
	let val = document.getElementById("themeSlider").checked;
	setCookie("theme",val);
	var r = document.querySelector(':root');
	
	if (val) { // Dark Mode
		r.style.setProperty('--bg-color', '#0F0F0F');
		r.style.setProperty('--block-color', '#333');
		r.style.setProperty('--text-color', 'white');
		r.style.setProperty('--header-color', 'lightgray');
		r.style.setProperty('--border-color', '#333');
		r.style.setProperty('--game-border-color', 'white');
		
	} else { //Light Mode
		r.style.setProperty('--bg-color', '#F0F2F5');
		r.style.setProperty('--block-color', '#FFFFFF');
		r.style.setProperty('--text-color', 'black');
		r.style.setProperty('--header-color', '#333');
		r.style.setProperty('--border-color', '#CCC');
		r.style.setProperty('--game-border-color', '#CCC');
	}
}

function setCookie(cname,cvalue) {
	// const d = new Date();
	// d.setTime(d.getTime() + (exdays*24*60*60*1000));
	// let expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";";
}

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {

			return c.substring(name.length, c.length);
			
		}
	}
	return "";
}

function checkCookie(name) {
	
	let val = getCookie(name);
	
	
	if (name == "theme") {
		let slider = document.getElementById("themeSlider");
		if (val != "") {
			if (val == "true") slider.checked = true; else slider.checked = false;
			changeTheme();
		} else {
			slider.checked = true;
			changeTheme();
		}
	}
	
	if (name == "volume") {
		
		if (val != "") {
			if (val == "true") globalVolume = true;
			else globalVolume = false;
	
			audioList.forEach(function(audio) {
		
				audio.setVolume();
			});
			
			if (globalVolume) muteButton.innerHTML = "\u{1F50A}";
			else muteButton.innerHTML = "\u{1F507}";
	
		}
	}
	
	if (name == "bestTime1") {
	
		
		if (val != "") {
			bestTime1 = val;	
			//setBestTimeText(val);
		}	
	}
	
	if (name == "bestTime2") {
	
		
		if (val != "") {
			bestTime2 = val;	
			//setBestTimeText(val);
		}	
	}
	
	if (name == "bestTime3") {
	
		
		if (val != "") {
			bestTime3 = val;	
			//setBestTimeText(val);
		}	
	}
	
	//alert(name);
}

function menuResize() {  //Changes menu when resizing window
		
	var width = window.innerWidth;
	var height = window.innerHeight;
	var menu = document.getElementById("dropdown")
	var links = document.getElementsByClassName("barLinks")
	var title = document.getElementById("title")
	var canvas = document.getElementById("canvas");
	
	
	if (width < 700) {
		var r = document.querySelector(':root');
		r.style.setProperty('--box-align', 'center');
	} else  {
		var r = document.querySelector(':root');
		r.style.setProperty('--box-align', 'left');
	}

	if (width > 900) 
	{ 
		
		
		for (var i = 0; i < links.length; i++){
			links[i].hidden = false;
		}
		
		
	}
	else //Hides menu button and unhides links when window width is greater than 900
	{ 

		for (var i = 0; i < links.length; i++){
			links[i].hidden = true;
		}
		
		title.hidden = false;
		

	}
	
	
	
	if (canvas != null) {
		
		var ratio = canvas.width/canvas.height;
		
		var w = 115;
		var h = 150;

		if ((width-w)/(height-h) < ratio && width < canvas.width + w) {
			
			canvas.style.width = width - w + "px";
			canvas.style.height = (width-w) * 5/9  + "px";
			
		} 
		
		if ((width-w)/(height-h) > ratio && height < canvas.height + h) {
			
			canvas.style.height = height - h +"px";
			canvas.style.width = (height-h) * 9/5 +"px";
			
		} 
		
		
		if (canvas.width + w < width && canvas.height + h < height) {
	
			canvas.style.removeProperty('width');
			canvas.style.removeProperty('height');
			
		}
	
	
		if (width < 700) {
			//canvas.remove();
			//document.getElementById("pongButton").remove();
			//document.getElementById("mainInner").innerHTML += "<div class='intro'> Cannot play on this screen. &#128542;</div>";
		}
	}
}

function menuButtonClicked() {
	
	
	isMouseHover = !isMouseHover;
	
	let dropdownContent = document.getElementById("dropdown-content");
	let dropdown = document.getElementById("dropdown");
	
	dropdownContent.addEventListener("mouseleave", function (event) {
		isMouseHover = false;
	}, false);
	
	dropdownContent.addEventListener("mouseover", function (event) {
		isMouseHover = true;
	}, false);
	
	dropdown.addEventListener("mouseleave", function (event) {
		isMouseHover = false;
	}, false);

	var r = document.querySelector(':root');
	r.style.setProperty("--dropdown-display","block");
	//menuOpen = true;
	
	
	
}

function pageClicked() {
	if (!isMouseHover) {
		var r = document.querySelector(':root');
		r.style.setProperty("--dropdown-display","none");
	}
}

function loadMenuBar() {

	let elem = document.getElementById("topBar");
	elem.innerHTML += `
	
		<div id='topBarInner'>
			<div id='topBarLeft' >
			
				<a href='index.html'><image id='logo' src='images/logo.jpg'></image></a>
				<a class='barLinks' id='title' href='index.html'> INKERDINK.COM </a>
				<a class='barLinks' href='InkerdinkStory.html'> Inkerdink Story </a>
				<a class='barLinks' href='Apps.html'> Games and Apps </a>
			
			</div>
			
			<div id='topBarRight'>
				
				<div class='dropdown' id='dropdown' onClick='menuButtonClicked()' onload='addListener()'>
					<div class='dropbtn'> </div>
					<div class='dropdown-content' id='dropdown-content'>
						<a href='index.html'>Home</a>
						<a href='InkerdinkStory.html'>Inkerdink Story</a>
						<a href='Apps.html'>Games and Apps</a>
						

						<div id='themeDiv'>
							<div id='themeLabel'>Dark Mode</div>
							<label class='switch'>
								<input type='checkbox' id='themeSlider' onclick='changeTheme()'>
								<span class='themeSlider round'></span>
							</label>
						</div>
				
					</div>
				</div>
			</div>
		</div>
		
		
		`

}

//Passer Rating Scripts
function checkInput(element, min) {
    if (element.value < min)
      element.value = min;

    element.value = Math.round(element.value);
    document.getElementById("attempts").style = "border-color: none";
  }

function minMax(num) {
	if (num < 0) return 0;
	else if (num > 2.375) return 2.375;
	else return num;
}

function submitForm() {
	var attempts = document.getElementById("attempts").value;;

	if (attempts==0) {
		  document.getElementById("output").innerHTML = "Attempts must be a positive number";
		  document.getElementById("attempts").style = "border-color: red";
	} else { 
		  document.getElementById("attempts").style = "border-color: none";
		  var completions = document.getElementById("completions").value;
		  var yards = document.getElementById("yards").value;
		  var touchdowns = document.getElementById("touchdowns").value;
		  var interceptions = document.getElementById("interceptions").value;
		  var a = minMax((completions/attempts - 0.3)*5);
		  var b = minMax((yards/attempts - 3)*0.25);
		  var c = minMax((touchdowns/attempts)*20);
		  var d = minMax(2.375 - interceptions*25/attempts);
		  var rating = parseFloat((a+b+c+d)*100/6).toFixed(2);
		  if (rating == "NaN") rating = "Invalid inputs";
		  document.getElementById("output").innerHTML = "Passer Rating: " + rating;
	}
}




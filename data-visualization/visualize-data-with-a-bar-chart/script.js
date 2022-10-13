const dataUrl =
	"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

// event handler to work after page content has loaded
document.addEventListener("DOMContentLoaded", function () {
	const title = d3.select("#title"); // select #title element and store as title
	const svg = d3.select("#root"); // select #root element and store as svg
	const w = 800;
	const h = 500;
	const padding = 60;

	//sampleCirclesTest(svg); // uncomment call to test function

	//set svg size
	svg.attr("width", w).attr("height", h);

	const req = new XMLHttpRequest();
	req.open("GET", dataUrl, true);
	req.send();
	req.onload = function () {
		const json = JSON.parse(req.responseText); // convert string to object
		console.log(json); // uncomment to print json file directly as an object
		console.log(new Date(json.data[0][0]));

		// set title element text from json
		title.text(`${json.source_name} : ${json.code}`);

		// get x and y axis scales
		const xScale = d3
			.scaleTime() // set scale type to time, becouse of dates values read from index 0 of data
			.domain([
				d3.min(json.data, (d) => new Date(d[0])), // set domain based on date data from json.data[0]
				d3.max(json.data, (d) => new Date(d[0])), // set domain based on date data from json.data[0]
			])
			.range([padding, w - padding]);
		const yScale = d3
			.scaleLinear()
			.domain([0, d3.max(json.data, (d) => d[1])])
			.range([h - padding, padding]);

		// create x and y axis
		const xAxis = d3.axisBottom(xScale); //.tickFormat(d3.format("d")); // quit comma thousands separator in values format
		const yAxis = d3.axisLeft(yScale);

		// draw x and y axis
		svg.append("g")
			.attr("id", "x-axis")
			.attr("transform", "translate(0, " + (h - padding) + ")")
			.call(xAxis.ticks(d3.timeYear.every(5))); // set ticks to each 5 years
		svg.append("g")
			.attr("id", "y-axis")
			.attr("transform", "translate(" + padding + ", 0)")
			.call(yAxis);

		// select tick elements to add tick class to them
		d3.selectAll("ticks").attr("class", "tick");

		// create toolTip elements that will show data of bar on mouseover event
		let tooltip = d3
			.select("body")
			.append("div")
			.attr("id", "tooltip")
			.style("position", "absolute")
			.style("visibility", "hidden")
			.style("z-index", "10")
			.style("background", "#000")
			.style("width", "200px")
			.style("height", "70px")
			.style("padding", "5px")
			.style("color", "white")
			.style("transition-duration", "100ms");

		// draw rects for each data entry
		svg.selectAll("rect")
			.data(json.data)
			.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("x", (d) => xScale(new Date(d[0]))) // set rect on date data from json.data[0]
			.attr("y", (d) => yScale(d[1]))
			.attr("width", 2)
			.attr("height", (d) => h - padding - yScale(d[1]))
			.attr("fill", "orangered")
			.attr("data-date", (d) => d[0])
			.attr("data-gdp", (d) => d[1])
			.style("transition-duration", "50ms")
			.on("mouseover", (e) => {
				// add mouseover event to bars
				tooltip
					.style("top", "200px")
					.style("left", "200px")
					.style("visibility", "visible")
					.text(`Date: ${e[0]}\n GDP: ${e[1]}`)
					.style("font-size", "20px"); // show tooltip
			})
			.on("mouseout", (e) => {
				// add mouseout event to bars
				tooltip.style("visibility", "hidden"); // hide tooltip
			});

		// show a toolTip on mouse over the svg element to show point data
	};
});

// test function that draws 3 color circles in svg element
function sampleCirclesTest(svg) {
	// change svg size and background color
	svg.attr("width", 240)
		.attr("height", 240)
		.style("background-color", "lightgray");
	// add red circle to svg
	svg.append("circle")
		.attr("cx", 40)
		.attr("cy", 40)
		.attr("r", 40)
		.style("fill", "red");
	// add green circle to svg
	svg.append("circle")
		.attr("cx", 120)
		.attr("cy", 120)
		.attr("r", 40)
		.style("fill", "green");
	// add blue circle to svg
	svg.append("circle")
		.attr("cx", 200)
		.attr("cy", 200)
		.attr("r", 40)
		.style("fill", "blue");
}

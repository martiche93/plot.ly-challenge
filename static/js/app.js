// Read in samples.json file using D3 and create a dropdown menu
function dropdown() {
    d3.json("samples.json").then(data => {
        var sampleName = data.names;
        var dataID = d3.select("#selDataset")
        sampleName.forEach((sampleID) => {
            dataID.append("option")
                .text(sampleID)
                .property("value", sampleID)
        })
        var sampleOne = sampleName[0];
        metadata(sampleOne);
        Charts(sampleOne);
    });
};
// Call upon dropdown function
dropdown();

// Next, create a function for the demographic metadata for selected sample ID
function metadata(id) {
    d3.json("samples.json").then(data => {
        var sampleMetadata = data.metadata;
        var result = sampleMetadata.filter(obj => obj.id == id);
        var resultFilter = result[0];
        var display = d3.select("#sample-metadata");
        display.html("");
        Object.entries(resultFilter).forEach(([key, value]) => {
            display.append("h6").text(`${key}: ${value}`);
        });
    });
}

// Create a function by creating a variable for each requirment
function Charts(id) {
    d3.json("samples.json").then(data => {
        var sampleData = data.samples;
        var result = sampleData.filter(obj => obj.id == id);
        var resultFilter = result[0];
        var otu_ids = resultFilter.otu_ids;
        var otu_labels = resultFilter.otu_labels;
        var sample_values = resultFilter.sample_values;
        var bubbledata = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }];
        var barData = [{
            y: otu_ids.slice(0, 10).map(val => `OTU ${val}`).reverse(),
            x: sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
        }];
        Plotly.newPlot("bar", barData);
        Plotly.newPlot("bubble", bubbledata);
    });
};

// Create a function that changes the data for each selection
function optionChanged(changedID) {
    metadata(changedID);
    Charts(changedID);
};
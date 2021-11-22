//scan the data and print it on the console
//const buttons ="samples.json";
    //d3.json(buttons).then(data => {
    // console.log(data);
    //}); 

//setup the function for demographics
function buildMetadata(sample) {

    //setup a code to read the json file and panel in html
    d3.json("samples.json").then((data) => {
        //console.log(sampledata)
        
        var metadata = data.metadata;

        var output = metadata.filter(sampleObj => sampleObj.id == sample);

        var result = output[0];

        var html_panel  = d3.select("#sample-metadata");

        html_panel.html("");

        //loop through the output and append the html_panel
        Object.entries(result).forEach(([key,value]) => {html_panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });

        buildGauge(result.wfreq);

    });
}

//setup the plots after the data is scanned

function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;

        var output = samples.filter(sampleObj => sampleObj.id == sample);
        var result = output[0];  

        //read plots 
        var values = result.values;
        //console.log(values);

        var otu_ids = result.otu_ids;
        //console.log(otu_ids);

        var otu_labels = result.otu_labels;
        //console.log(otu_labels);

        var sample_values = result.sample_values;

        var top_otu = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
        //console.log(top_otu);

        var top_otu_labels = otu_labels.slice(0,10).reverse();
        //console.log(top_otu_labels);

        //var top_otu_values = sample_values.slice(0,10).reverse();
        //console.log(top_otu_values);

        var data_trace_1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                color: otu_ids,
                size: sample_values,
                colorscale: "Earth" 
            }
        };
        
        var data_1 = [data_trace_1];

        var data_layout_1 = {
            title: "Top 10 OTUs - Bacteria Cultures",
            hovermode : "closest",
            xaxis: {title: "OTU ID"},
            yaxis: {tickmode: "linear",
            },

            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };

        //creating the first bubble chart 
        Plotly.newplot("bubble", data_1, data_layout_1);

        //bar chart 
        data_trace_2 = {
            x: sample_values,
            y: top_otu,
            type: "bar",
            orientation: "h",
            mode: "markers",
            marker: {
                size: values,
                color: otu_ids
                },
            text: top_otu_labels
        };

        var data_layout_2 = {
            title: "OTU ID - Top 10 Bacteria Cultures",
            height: 500,
            width: 1100
        };

        Plotly.newPlot("bubble",data_trace_2,data_layout_2);

    });
}

//setting up the intial data 

function init() {

    var select = d3.select("#selDataset");
    //console.log(select)

    d3.json("samples.json").then((data) => {
        //console.log(data);

        var drop_down = data.names;
        
        drop_down.forEach((sample) => {select
            .append("option")
            .text(sample)
            .property("value",sample);
        });    

        var ID_first = drop_down[0];
        buildCharts(ID_first),
        demographics_data(ID_first);
    });

}

//change event setup
function optionChanged(samplenew) {
    //console.log(samplenew);
    buildCharts(samplenew);
    buildMetadata(samplenew);
}

init();


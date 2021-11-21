//scan the data and print it on the console
const buttons ="static/js/samples.json";
    d3.json(buttons).then(data => {
    // console.log(data);
    }); 

//setup the function for demographics
function demographics_data(id) {

    //setup a code to read the json file and panel in html
    d3.json(buttons).then((data) => {
        //console.log(sampledata)
        
        var metadata = data.metadata;

        var output = metadata.filter(idobject => idobject.id == id);

        var result = output[0];

        var html_panel  = d3.select("#sample-metadata");

        html_panel.html("");

        //loop through the output and append the html_panel
        Object.entries(result).forEach(([key,value]) => {
            html_panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });

    });

//setup the plots after the data is scanned

function interactive_plot(id) {
    d3.json(buttons).then(sampledata => {
        //console.log(sampledata)
        //console.log(id);

        var output = sampledata.samples.filter(idobject => idobject.id == id);
        var result = output[0]  

        //read plots 
        var values = result.values;
        //console.log(values);

        var otu_ids = results.otu_ids;
        console.log(otu_ids);

        var otu_labels = results.otu_labels;
        console.log(otu_labels);

        var top_otu = otu_top = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
        console.log(top_otu);

        var top_otu_labels = otu_labels.slice(0,10).reverse();
        console.log(top_otu_labels);

        var top_otu_values = sample_values.slice(0,10).reverse();
        console.log(top_otu_values);

        var data_trace_1 = {
            x: top_otu_values,
            y: top_otu,
            text: top_otu_labels,
            marker: {color:"blue"},
            type: "bar",
            orientation: "h" 
            };
        
        var data_1 = [data_trace_1];

        var data_layout_1 = {
            title: "Top 10 OTUs",
            yaxis: {tickmode: "linear",
            },

            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };

        //creating the first bar chart 
        Plotly.barplot("bar", data_1, data_layout_1);

            //bubble chart 
            data_trace_2 = {
                x: otu_ids,
                y: values,
                mode: "markers",
                marker: {
                    size: values,
                    color: otu_ids
                },
                text: otu_labels
            };

            var data_layout_2 = {
                title: "OTU ID",
                height: 500,
                width: 1100
            };

            var data_2 = [data_trace_2];

        Plotly.newPlot("bubble",data_2,data_layout_2);

    });
}


//change event setup
function optionChanged(id) {
    console.log(id);
    interactive_plot(id);
    demographics_data(id);
}

//setting up the intial data 

function initial_data_display() {

    var select = d3.select("#selDataset");
    //console.log(select)

    d3.json(buttons).then((data) => {
        console.log(data);

        var drop_down = data.names;
        drop_down.forEach((name) => {
            select.append("option").text(name).property("value",name);
        });    

        var ID_first = data.names[0];
        interactive_plot(ID_first),
        demographics_data(ID_first);
    });

}

initial_data_display();

}
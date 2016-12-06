
//////////// SOUND ///////////////////

var soundID = "Game-Spawn";

function loadSound() {
    createjs.Sound.registerSound("files/Game-Spawn.ogg", soundID);
}

function playSound() {
    createjs.Sound.play(soundID);
}


///////////////////////////////////

$(".dial").knob();

var d = new Date();

var freeMem = new Array(10).fill({
    x: 0,
    y: (new Date()).getTime()
});
var usedMem = new Array(10).fill({
    x: 0,
    y: (new Date()).getTime()
});
var dateMem = new Array(10);


var tmpMemFree;
var tmpMemUsef;


////////////////////////// CPU & DISK ////////////////////////////////////////

var cpuSource = new EventSource('cpu.php');

cpuSource.onmessage = function(e) {

    //var c = parseFloat(e.data);
    var tmpCpu = e.data.split(',')

    console.log('DATA: ', tmpCpu);
    console.log('%CPU: ', tmpCpu[2]);


    var c = parseFloat(tmpCpu[2]);

    var tmpDisk = tmpCpu[0].split(' ');

    console.log('DISK: ', tmpDisk);



    $("#diskSpace").html(tmpDisk[0]);
    $("#used").html(tmpDisk[1]);
    $("#ava").html(tmpDisk[2]);
    $("#usper").html(tmpDisk[3]);



    if (parseInt(c) < 10) {
        colorFg = "#388E3C";
        //console.log("colorFg: ", colorFg," - Number", parseInt(c))
    }

    if (parseInt(c) > 9 && parseInt(c) < 50) {
        colorFg = "#FBC02D";
        ///console.log("colorFg: ", colorFg," - Number", parseInt(c))            
    }

    if (parseInt(c) > 50) {
        colorFg = "#d32f2f";
        //console.log("colorFg: ", colorFg," - Number", parseInt(c))
        createjs.Sound.play(soundID);
    }



    $('.dial').trigger('configure', {
        'readOnly': true,
        'inputColor': '#999',
        'fgColor': colorFg
    });

    $('.dial').val(c).trigger('change');

}


////////////////////////// SERVER  /////////////////////////////////////////


var source = new EventSource('index.php');

source.onmessage = function(e) {


    var cpu = 0,
        task = 0,
        top = 0,
        mem = 0;

    var tmpData = [];
    var tmpDataMem = [];

    var tmpFree = [];
    var tmpUsed = [];

    var colorFg;


    top = e.data.split(';')[0];
    task = e.data.split(';')[1];
    cpu = e.data.split(';')[2];
    mem = e.data.split(';')[3];

    console.log("top:",top);
    console.log("top []:",top.split(/\s+/g));

    var tmpTop = top.split(';')[0].split(": ")[1].split(', ');
    var tmpData = tmpTop.map(function(num) {
        return parseFloat(num);
    });



    var tmpCpu = parseFloat(cpu.split(' ')[2]);
    var tmpTask = task.split(' ')[1];
    var tmpUser = top.split(/\s+/g)[8];
    var tmpRun = task.split(' ')[5];
    var tmpRun = task.split(' ')[5];
    var tmpSleep = task.split(', ')[2].split(' ')[0];
    var tmpStop = task.split(', ')[3].split(' ')[2];


    console.log("Mem:", mem);

    tmpMemFree = 0;
    tmpMemUsef = 0;


    tmpMemFree = parseFloat(mem.split(/\s+/g)[5]);
    //tmpMemFree = parseFloat(mem.split(', ')[1].split(' ')[2]);
    tmpMemUsef = parseFloat(mem.split(/\s+/g)[7]);

    console.log("MEM Free Bytes:", numeral(tmpMemFree).format('0.00b'));
    console.log("MEM Use Bytes:", numeral(tmpMemUsef).format('0.00b'));

    console.log('Used Mem: ', tmpMemUsef);
    console.log('Free Mem: ', tmpMemFree);


    tmpDataMem.push([tmpMemFree]);
    tmpDataMem.push([tmpMemUsef]);

    freeMem.shift(0);
    freeMem.push({
        x: tmpMemFree,
        y: (new Date()).getTime()
    });

    usedMem.shift(0);
    usedMem.push({
        x: tmpMemUsef,
        y: (new Date()).getTime()
    });


    loadServer(tmpData);

    $("#user").html(tmpUser);
    $("#task").html(tmpTask);
    $("#running").html(tmpRun);
    $("#sleep").html(tmpSleep);
    $("#stop").html(tmpStop);
};



/////////////////////////////////// LOAD GRAPHIC //////////////////////////////

function loadServer(data) {
    // body...


    $('#container').highcharts({
        chart: {
            type: 'line',
            animation: false,
            spacingBottom: 30
        },
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        subtitle: {
            text: '',
            floating: true,
            align: 'right',
            verticalAlign: 'bottom',
            y: 15
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'bottom',
            x: 150,
            y: 100,
            floating: true,
            borderWidth: 1,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        xAxis: {
            categories: ['1-min', '5-min', '15-min']
        },
        yAxis: {
            title: {
                text: ''
            },
            labels: {
                formatter: function() {
                    return this.value;
                }
            }
        },
        tooltip: {
            formatter: function() {
                return '<b>' + this.series.name + '</b><br/>' +
                    this.x + ': ' + this.y;
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                animation: false,
                enableMouseTracking: false
            },
            lineWidth: 10,
            series: {
                dataLabels: {
                    enabled: true,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderWidth: 1,
                    borderColor: '#AAA',
                    y: -6
                },
                marker: {
                    enabled: true,
                    symbol: 'circle',
                    radius: 5
                }
            }
        },
        series: [{
            name: 'Load Server',
            data: data,
            zoneAxis: 'y',
            lineWidth: 4,
            zones: [{
                value: 1,
                color: '#4db6ac'
            }, {
                value: 2,
                color: '#FBC02D'
            }, {
                value: 3,
                color: '#d32f2f'
            }]
        }]
    });
}





/////////////////////////////////// MEMORY GRAPHIC /////////////////////////


Highcharts.setOptions({
    global: {
        useUTC: false
    }
});

var chart;
$('#memory').highcharts({
    chart: {
        type: 'spline',
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
        events: {
            load: function() {

                // set up the updating of the chart each second
                var series = this.series[0];
                var series2 = this.series[1];
                setInterval(function() {
                    var x = (new Date()).getTime(), // current time
                        y = tmpMemFree;
                    z = tmpMemUsef;
                    series.addPoint([x, y], false, true);
                    series2.addPoint([x, z], true, true);
                }, 1000);
            }
        }
    },
    title: {
        text: ''
    },
    credits: {
        enabled: false
    },
    xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
    },
    yAxis: [{
        title: {
            text: ''
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    }, {
        title: {
            text: ''
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    }],
    tooltip: {
        formatter: function() {
            var a = numeral(this.y).format('0b')
            return '<b>' + this.series.name + '</b><br/>' +
                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + a;

        }
    },
    legend: {
        enabled: true
    },
    exporting: {
        enabled: false
    },
    series: [{
        name: 'Free Memory',
        type: 'areaspline',
        color: '#00b9d8',
        fillOpacity: 0.3,
        data: (function() {
            // generate an array of random data
            var data = [],
                time = (new Date()).getTime(),
                i;

            for (i = -9; i <= 0; i += 1) {
                data.push({
                    x: time + i * 1000,
                    y: Math.random()
                });
            }
            return data;
        }())
    }, {
        name: 'Used Memory',
        type: 'areaspline',
        color: '#d9006e',
        fillOpacity: 0.53,
        dashStyle: 'dash',
        data: (function() {
            // generate an array of random data
            var data = [],
                time = (new Date()).getTime(),
                i;

            for (i = -9; i <= 0; i += 1) {
                data.push({
                    x: time + i * 1000,
                    y: Math.random()
                });
            }
            return data;
        }())
    }]
});


//////////////////////  DIALOGS ////////////////////////



var dialog = document.querySelector('dialog');
    var showDialogButton = document.querySelector('#show-disk');
    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    showDialogButton.addEventListener('click', function() {

        fetch('diskInfo.php', {mode: 'cors'})  
          .then(function(response) {             
            return response.text();  
          })  
          .then(function(text) {  
            //console.log('Request successful', text);  

            //$("#infoDisk").html(text);

            //diskInfo(text);

            var x = text.split(',');

/*

      Filesystem              Type      Size  Used Avail Use% Mounted on

d1    devtmpfs                devtmpfs  2.3G     0  2.3G   0% /dev
d2    tmpfs                   tmpfs     2.2G     0  2.2G   0% /dev/shm
d3    tmpfs                   tmpfs     2.2G   57M  2.2G   3% /run
d4    tmpfs                   tmpfs     2.2G     0  2.2G   0% /sys/fs/cgroup
d5    /dev/mapper/centos-home xfs        25G   11G   15G  43% /home
d6    /dev/xvda1              xfs       497M  210M  287M  43% /boot


*/            

            
            for( i = 1; i < 7; i++ ){

                console.log("% = ", parseInt(x[i].split(/\s+/g)[5]) );
                console.log("DISK = ", x[i].split(/\s+/g)[6]);
                
                document.querySelector('span.d'+i).innerText =  x[i].split(/\s+/g)[5];
                document.querySelector('progress.d'+i).value =  parseFloat(x[i].split(/\s+/g)[5]);

                //console.log("X===== ",x[i]);
            }
    


          })  
          .catch(function(error) {  
            console.log('Request failed', error)  
          });


      dialog.showModal();
    });
    dialog.querySelector('.close').addEventListener('click', function() {
      dialog.close();
    });

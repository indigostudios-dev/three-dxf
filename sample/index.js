var progress = document.getElementById('file-progress-bar');
var $progress = $('.progress');
var dxfContentEl = $('#dxf-content')[0];

// Setup the dnd listeners.
var dropZone = $('.drop-zone');
dropZone.on('dragover', handleDragOver, false);
dropZone.on('drop', onFileSelected, false);

document.getElementById('dxf').addEventListener('change', onFileSelected, false);

function onFileSelected(evt) {
    var file = evt.target.files[0];

    window.history.pushState(null, null, "/");

    loadFile(file);
}

function loadFile(file) {
    const output = [];
       
    output.push('<li><strong>', encodeURI(file.name), '</strong> (', file.type || 'n/a', ') - ',
    file.size, ' bytes, last modified: ',
    file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a',
    '</li>');
    document.getElementById('file-description').innerHTML = '<ul>' + output.join('') + '</ul>';
    
    progress.style.width = '0%';
    progress.textContent = '0%';
    $progress.addClass('loading');

    readFile(file);
}

function readFile(file) {
    const reader = new FileReader();
    reader.onprogress = updateProgress;
    reader.onloadend = onSuccess;
    reader.onabort = abortUpload;
    reader.onerror = errorHandler;
    reader.readAsText(file);
}

function abortUpload() {
    console.log('Aborted read!')
}

function errorHandler(evt) {
    switch(evt.target.error.code) {
    case evt.target.error.NOT_FOUND_ERR:
        alert('File Not Found!');
        break;
    case evt.target.error.NOT_READABLE_ERR:
        alert('File is not readable');
        break;
    case evt.target.error.ABORT_ERR:
        break; // noop
    default:
        alert('An error occurred reading this file.');
    }
}

function updateProgress(evt) {
    if(evt.lengthComputable) {
        var percentLoaded = Math.round((evt.loaded /evt.total) * 100);
        if (percentLoaded < 100) {
            progress.style.width = percentLoaded + '%';
            progress.textContent = percentLoaded + '%';
        }
    }
}

function onSuccess(evt){
    var fileReader = evt.target;
    if(fileReader.error) return console.log("error onloadend!?");
    progress.style.width = '100%';
    progress.textContent = '100%';
    setTimeout(function() { $progress.removeClass('loading'); }, 2000);
    var parser = new DxfParser();
    var dxf = parser.parseSync(fileReader.result);
    
    if(dxf) {
        dxfContentEl.innerHTML = JSON.stringify(dxf, null, 2);
    } else {
        dxfContentEl.innerHTML = 'No data.';
    }

    performance.mark("viewerLoadMark");

    var cadCanvas = new ThreeDxf.Viewer(dxf, document.getElementById('cad-view'));

    performance.measure("threedfx-load-time", "viewerLoadMark");
    
    var elapsed = performance.getEntriesByName("threedfx-load-time", "measure")[0].duration;
    console.log("Load complete in: " + elapsed + 'ms');

    performance.clearMarks();
    performance.clearMeasures();
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

const urlParams = new URLSearchParams(window.location.search);
const fileName = urlParams.get('file');

if (!!fileName === true) {
    window.history.pushState(null, null, "?file=" + fileName);

    $.ajax({
        url: `data/${fileName}`,
        // cache: false,
        xhr: function(){
            var xhr = new XMLHttpRequest();
            xhr.responseType= 'blob'
            return xhr;
        },
        success: readFile,
        error: errorHandler
    })
}
// SETUP CONSOLE/TRACER
function setConsole(frame) {
	// ADDING ELEMENTS TO THE DOM
	var html = '<div id="console" >'+
			    '<code id="tracer" ></code>'+
				'<label id="cmd-label" for="cmd" >\\></label>'+
				'<input type="text" id="cmd" />'+
			'</div>';
	var css = '<style >/* CONSOLE STYLES */'+
				'#console {'+
				'	position:absolute;'+
				'	font-family:Courier;'+
				'	z-index:2;'+
				'	background-color:rgba(0,0,0,0.5);'+
				'	top:0px;'+
				'	width:640px;'+
				'	height:130px;'+
				'	left:0px;'+
				'	font-size:10px;'+
				'	color:lime;'+
				'}'+
				'#tracer {'+
				'	position:absolute;'+
				'	top:0px;'+
				'	width:98%;'+
				'	height:115px;'+
				'	left:0%;'+
				'	overflow-y:scroll;'+
				'	border:none;'+
				'    background:none;'+
				'	color:lime;'+
				'	padding: 0 1% 0 1%;'+
				'	line-height: 12px;'+
				'}'+
				'#tracer::-webkit-scrollbar-track {'+
				'    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);'+
				'    background-color: rgba(255,255,255,0.15);'+
				'}'+
				'#tracer::-webkit-scrollbar {'+
				'    width: 10px;'+
				'    background-color:rgba(255,255,255,0.15);'+
				'}'+
				'#tracer::-webkit-scrollbar-thumb {'+
				'    background-color:rgba(255,255,255,0.15);'+
				'}'+
				'.console-line {'+
				'	display:block;'+
				'}'+
				'#cmd {'+
				'	position:absolute;'+
				'	padding:0;'+
				'	bottom:0px;'+
				'	width:95%;'+
				'	height:15px;'+
				'	left:5%;'+
				'	border:none;'+
				'	background:none;'+
				'	color:cyan;'+
				'	font-size: 10px;'+
				'	line-height:15px;'+
				'	background-color:rgba(255, 255, 255, 0.15);'+
				'	font-family:Courier;'+
				'}'+
				'#cmd:focus {'+
				'	outline:none;'+
				'	background-color:rgba(0,139,139,0.5);'+
				'}'+
				'#cmd-label {'+
				'	position:absolute;'+
				'	text-align:center;'+
				'	line-height:15px;'+
				'	bottom:0px;'+
				'	width:5%;'+
				'	height:15px;'+
				'	background-color:rgba(255, 255, 255, 0.2);'+
				'}'+
				'/* CONSOLE COLORS */'+
				'.number {'+
				'    color:grey;'+
				'}'+
				'.base {'+
				'    color:greenyellow;'+
				'}'+
				'.error {'+
				'    color:crimson;'+
				'}'+
				'.response {'+
				'    color:cadetblue;'+
				'}'+
				'.expression {'+
				'    color:aquamarine;'+
				'}'+
				'.type {'+
				'	color:darkolivegreen;'+
				'}'+
				'.result {'+
				'	color:cornflowerblue;'+
				'}'+
				'</style>';
	// CAPTURING FRAME OBJECT AND ADDING THE ACTUAL ELEMENTS
	var fr = document.getElementById(frame);
	fr.innerHTML += html;
	var hd = document.getElementsByTagName("head")[0];
	hd.innerHTML += css;
	// CAPTURING TRACER
	var trc = document.getElementById('tracer');
	//
	// CAPTURING CONSOLE INPUT
	var csl = document.getElementById('cmd');
	//
	// CAPTURING CONOLE HISTORY
	var htr = [];
	var tle = 0;
	// TRACES COUNTER
	traces = 0;
	//
	// FUNCTIONS
	//
	// FINDING TYPE OF AN ELEMENT AND RETURN VALUE(S)
	var type = function(val) {
		var newVal;
		switch(true) {
			case (!!val) && (val.constructor === Number) :
				newVal = '<span class="expression" >'+val.toString()+'</span><span class="type" >:Number</span>';
				break;
			case (!!val) && (val.constructor === String) :
				newVal = '<span class="expression" >'+val.toString()+'</span><span class="type" >:String</span>';
				break;
			case (!!val) && (val.constructor === Array) :
				newVal = '<span class="expression" >';
				for (var aa in val) {
					if (aa < (val.length-1)) {
						newVal += val[aa].toString()+', ';
					}else {
						newVal += val[aa].toString()+'</span><span class="type" >:Array</span>';
					}
				}
				break;
			case (!!val) && (val.constructor === Vector) :
				newVal = '<span class="expression" >';
				var bb = 0;
				for (item in val) {
					bb++;
					if (bb < Object.keys(val).length) {
						newVal += '"'+item.toString()+'" = '+val[item].toString()+', ';
					}else {
						newVal += '"'+item.toString()+'" = '+val[item].toString()+'</span><span class="type" >:Vector</span>';
					}
				}
				break;
			default :
				newVal = val+':default';
				break;
		}
		return newVal;
	};
	//
	// WRITING VALUE(S) ON TRACER
	trace = function() {
		traces++;
		for (var arg in arguments) {
			if (arguments.length > 1) {
				trc.innerHTML += '<span class="number" >['+traces+'.'+(1+parseInt(arg))+']</span><span class="base" > '+arguments[arg]+'</span><br>';
			}else {
				trc.innerHTML += '<span class="number" >['+traces+']</span><span class="base" > '+arguments[arg]+'</span><br>';
			}
		}
		trc.scrollTop = trc.scrollHeight;
	};
	//
	// CONSOLE INTERPRETER
	function read(val) {
		var ret;
		var val = val.toString();
		if (val=='') {
			ret = '<span class="response">no string to evaluate.</span>';
		}else {
			trace('<span class="response" >evaluating <span class="expression" >'+val+'</span> with JS.</span>');
			try {
				ret = eval(val);
				trace(type(ret)+'<span class="result" >:result</span>');
			} catch (e) {
				ret = e.message;
				ret = ret.replace(val,'<span class="expression" >'+val+'</span>');
				trace(ret+'<span class="error" >:error</span>');
			}
		}
		return ret;
	};
	//
	// CONSOLE INPUT
	csl.addEventListener('keydown', function(e) {
		var val = this.value;
		if (e.keyCode == 13) {
			read(val);
			htr.unshift(val);
			this.value = '';
		}else if (e.keyCode == 38) {
			e.preventDefault();
			if (htr.length>=1) {
				this.value = htr[tle];
			}else {
				this.value = '';
			}
			if (tle<(htr.length-1)) {
				tle++;
			}
		}else {
			if (e.keyCode == 40) {
				e.preventDefault();
				if (htr.length>=1) {
					this.value = htr[tle];
				}else {
					this.value = '';
				}
				if (tle>=0) {
					tle--;
				}
			}
		}
	});
	//
}
//
			var worky = null;
			
			if ( ! window.console ){
				console = { log: function(){} };	//support the console even if we don't have one
			}

			function __displayResult(data){
				var log = document.getElementById('log');
				var table = document.createElement('table');
				var tr = document.createElement('tr');
				var thNum = document.createElement('th');
				if(data.num){
					var txtNum = document.createTextNode(data.num);
					thNum.appendChild(txtNum);
				}
				tr.appendChild(thNum);
				var tdString = document.createElement('td');
				if(data.text){
					var txtString = document.createTextNode(data.text);
					tdString.appendChild(txtString);
				}
				tr.appendChild(tdString);
				table.appendChild(tr);	
				log.appendChild(table);
			}
			
			function __toggleRunButton(){
				var button = document.getElementById('runButton');
				if(button.value == '...Running'){	//turn on
					//button.disabled = false;
					button.value = "Run..."
				}
				else{	//turn off
					//button.disabled = true;
					button.value = "...Running";
				}
			}
			
			function doThisThing(form){
				if(typeof(Worker) !== "undefined"){
					console.log("Web workers supported");
					if(worky === null){
						console.log("No worker currently defined");
						__toggleRunButton();
						var power = form.it.value;
						var cycles =  Math.pow(2, power);
						var en = form.en.value;
						
						//config values for calculations
						var probs = {
							human: {
								error: 0.000000001,
								cycleProbs: {
									20: 1,
									21: 1,
									22: 1,
									25: 1,
									30: 1,
									35: 1,
									40: 1
								}
							},
							taq: {
								error: 0.000008,
								cycleProbs: {
									20: 0.01587,
									21: 0.01665,
									22: 0.01744,
									25: 0.01980,
									30: 0.02371,
									35: 0.02761,
									40: 0.03149
								}
							},
							pfu: {
								error: 0.0000013,
								cycleProbs: {
									20: 0.00259,
									21: 0.00272,
									22: 0.00288,
									25: 0.00324,
									30: 0.00389,
									35: 0.00453,
									40: 0.00518
								}
							}
						}
						var error = probs[en].error;
						var prob = probs[en].cycleProbs[power];
						var enteredText = form.string.value;
						var log = document.getElementById("log");
						log.innerHTML = "";	//clear log
						var numErrors = Math.floor((enteredText.length * cycles) * error * prob);
						console.log('errors = floor((enteredText.length * cycles) * error * prob)');
						console.log('errors = floor((' + enteredText.length + ' * ' + cycles + ') * ' + error + ' * ' + prob + ')');
						console.log('num errors: ' + numErrors);
						__displayResult(
							{
								num: 'Original',
								text: enteredText
							}
						);
						if(numErrors){	//only create a worker if we need to
							worky = new Worker("/scripts/services/pcr/worker.js");
							worky.addEventListener(
								'message',
								function(e){
									//console.log('Worker said: ', e.data);
									__displayResult(e.data);
									console.log("worker has ended");
									worky = null;
									__toggleRunButton();
						  		},
						  		false
							);
							//start the worker by giving it hte info it needs to run
							worky.postMessage(
								{
									numErrors: numErrors,
									startText: enteredText
								}
							);
						}
						else{
							__toggleRunButton();
						}
					}
				}
				else{
					alert('No web worker support');
				}
				return false;
			}

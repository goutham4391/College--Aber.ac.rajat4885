var ruleset;
var things_to_check="";
var arr_things_to_check=[];
jQuery.fn.fmval = function() {
	//polyfill function to check the type and either use .val() or ]:checked').val()
	//depending on the input type
	var fmSelector = $(this[0]).attr("name"); //first let's try the name
	if (typeof fmSelector === 'undefined' || !fmSelector)
	{	fmSelector = $(this[0]).attr("id");	//then let's try the id
	}
	if (typeof fmSelector === 'undefined' || !fmSelector) 
	{	//otherwise we're likely dealing with a checkbox group
		//we can use the selector attribute and strip out the numbers from it to get the input id
		fmSelector =$(this).selector.match(/\d+/)[0]+"[][]"; 
	}
    var fmFormType = $("[name='"+fmSelector+"']:first").attr("type"); 
    var fmSpecialFormType=["radio","checkbox"];
    var returnval=null;
    if(fmSpecialFormType.indexOf(fmFormType)!== -1)
    {	returnval=$("input[name='"+fmSelector+"']:checked").val();
	}
	else
	{	returnval=$("#"+fmSelector).val();
	}
    return returnval;
};

function parseData(data)
{	//console.log(form_id);
	ruleset=jQuery.parseJSON(data);
	//console.log("rulest:" +ruleset);
	var rules=[];
    for(rule in ruleset){
		parts=ruleset[rule];
		var count=0;
		//jQuery('#footer').append("<ul id='ie-console'></ul>")
		for(part in parts)
		{	//IE 7&8 does not like objToStr, using a fall back method - this is less tested and may cause issues
			if(jQuery('.ie7').length>0 || jQuery('.ie8').length>0)
			{	var ruleString=manObjToStr(JSON.stringify(parts[part]));
				//jQuery('#ie-console').append('<li>'+ruleString+'</li>');				
			}
			else
			{	var ruleString=objToStr(parts[part],"|");
				//console.log(ruleString);
			}		
			var rulesArray=ruleString.split(",");
			var innercount=0;
			var onerule='';
			jQuery.each(rulesArray, function(){
				if(this!="undefined")
				{	thisArray=this.split("|");
					if (innercount ==0)
					{	var condition = thisArray[0];
						onerule=onerule +'condition:'+ thisArray.splice(0, 1);	
					}
					if(thisArray[0] =="join" || thisArray[0]=="action")
					{	if(thisArray[0]=="join")
						{	onerule=onerule + '|' +'join:'+ thisArray[1];	
						}
						if(thisArray[0]=="action")
						{	onerule=onerule + '|action:'
							if(thisArray.length>3)
							{	
								/*if(thisArray[2].includes("label[for")){
									check_id=thisArray[2].replace(/[^0-9]/g,'');
									if(!$('label[for="' + check_id + '"]').length)
									{	thisArray[2]="#legend-"+check_id;			
									};
								} 
								if(thisArray[3].includes("label[for")){
									check_id=thisArray[3].replace(/[^0-9]/g,'');
									if(!$('label[for="' + check_id + '"]').length)
									{	thisArray[3]="#legend-"+check_id;			
									};
								} 
								if(thisArray[4].includes("label[for")){
									check_id=thisArray[4].replace(/[^0-9]/g,'');
									if(!$('label[for="' + check_id + '"]').length)
									{	thisArray[4]="#legend-"+check_id;			
									};
								} */
								onerule=onerule + (thisArray[1]+':'+thisArray[2]+':'+thisArray[3]+':'+thisArray[4]);					
							
								//console.log(thisArray[4]);
							}
							else
							{	/*Fix for radio & checkboxes where the label has been replaced with a fieldset legend*/
								if(thisArray[2].includes("label[for")){
									check_id=thisArray[2].replace(/[^0-9]/g,'');
									if(!$('label[for="' + check_id + '"]').length)
									{	thisArray[2]="#legend-"+check_id;			
									};
								}
								onerule=onerule + (thisArray[1]+':'+ thisArray[2]);
							}
							
						}		
					}	
					else
					{	if (thisArray.length ==5)
						{	onerule=onerule + '|' +'element:'+thisArray[0];
							thisArray.splice(0, 1);
							onerule=onerule + '|' + (thisArray[0]+':'+ thisArray[1]);
							onerule=onerule + '|function:' + (thisArray[2]+':'+ thisArray[3]);
						}		
					}
					innercount = innercount +1;
				}				
			});
			if(onerule!='')
			{	rules.push(onerule);
			}
			count=count+1;
		}		
	}
	
	//jQuery('#footer').append(rules);
	var final_rules=[];
	jQuery.each(rules,function( index, value ){
		final_rules.push(value.split("|"));
	});
	//console.log(final_rules);
	jQuery.each(final_rules,function( index, values )
	{ 	var action="";
	 	var cond="";
	 	var elems="";
	 	var logic="";
	 	var numeric="";
	 	var pre="";
	 	var post="";
	 	var elements=[];
	 	var functions=[];
	 	var element_count=0;
	 	if(findMatch(values,"join")!=-1)
	 	{	pre="(";
			post=")";
		}
	 	jQuery.each(values,function( index, value ){	
		var parts=value.split(":");
		switch(parts[0])
		{	case "condition":
			  cond=parts[1]+'(';
			  break;
			case "element":
			  colon_check=parts[1];
			  colon_check=replaceAll(";",":",colon_check);
			  if(element_count ==0)
			  {	elems=elems+pre+'jQuery("'+colon_check+'").val()';
			  }
			  else
			  {elems=elems+'jQuery("'+colon_check+'").val()';
			  }
			  element_count=element_count+1;
			  elements.push(colon_check);
			  break;
			case "join":
				var joiner="";
				switch(parts[1])
				{ case "and":
					joiner=" && ";
					break;
				  case "or":
					joiner=" || ";
					break;
				}
			  elems=elems+''+joiner+'(';
			  break;  
			case "value":
			  elems=elems+parts[1]+')';
			  break; 
			case "isNumeric":
			  numeric=+'jQuery.isNumeric(repl)'+parts[1]+'';
			  break;  
			case "action":		
			  switch(parts[1])
			  {  case "addup":
					 var vals=parts[2].split("+");
					 var sum=''; 
					 jQuery.each(vals,function( index, val )
					 {	 if(val!="undefined")
						 {	sum=sum+'Number(jQuery("'+val+'").val()) +';
						 }
					 });	
					 if(sum.charAt( sum.length-1 ) == "+") 
					 {	sum = sum.slice(0, -1)
					 }
					 action=action+'jQuery("'+parts[4]+'").val('+sum+');'
					 break;
				 case "subtract":
					 var vals=parts[2].split("-");
					 var sum=''; 
					 jQuery.each(vals,function( index, val ){			
						 if(val!="undefined")
						 {	sum=sum+'Number(jQuery("'+val+'").val()) -';
						 }
					 });	
					 if(sum.charAt( sum.length-1 ) == "-") 
					 {	sum = sum.slice(0, -1)
					 }
					 action=action+'jQuery("'+parts[4]+'").val('+sum+');'
					 break;
				 case "setzero":
					action=action+'jQuery("'+parts[2]+'").val(0);';
					break;
				 case "toggle_req_on":
				 		part_no_hash=parts[2].replace("#","");
						action=action+'jQuery("'+parts[2]+'").attr("required", "required");jQuery("label[for='+"'"+part_no_hash+"'"+']").addClass("dform-label-required");make_conditional_required("'+parts[2]+'");';					
					break;
				 case "toggle_req_off":
				 		part_no_hash=parts[2].replace("#","");
						action=action+'jQuery("'+parts[2]+'").removeProp("required");jQuery("label[for='+"'"+part_no_hash+"'"+']").removeClass("dform-label-required");jQuery("'+parts[2]+'").closest(".form-group").removeClass("val-error val-good"); jQuery("'+parts[2]+'").prop("selectedIndex",0);make_conditional_unrequired("'+parts[2]+'");';					
					break;					
				case "check":
					action=action+'jQuery("'+parts[2]+'").trigger("change");';
					break;
				 default:
					action=action+'jQuery("'+parts[2]+'").'+parts[1]+'(); ';
					break;
			  }		  
			  break; 
			case "function":
			  functions.push( Array(parts[1] , parts[2]));
			  break; 
		}		
		});
		if (numeric!='')
		{	jQuery.each(elements,function( index, value ){			
				orig='jQuery("'+value+'").val()';
				replace='jQuery.isNumeric(jQuery("'+value+'").val()))';
				elems =elems.replace(orig, replace);
			});			
		}				
		logic=cond+elems;
		if(element_count>1)
		{	logic=logic+')';
		}
		logic=logic+'{'+action+'}';		
		jQuery.each(elements,function( index, value )
		{	things_to_check=things_to_check+value+'|';
		});	
		set_to_check();
		jQuery.each(functions,function( index, value )
		{	if (value[0]=="observe")
			{	setObserve(elements[index], value[1], logic);
			}
		});					
	
	});
	jQuery.each(arr_things_to_check,function( index, value )
	{	jQuery(value).trigger('change');
	});	
}


function setObserve(element, action, callback)
{	//console.log(element+' '+action, callback);
	if(element.indexOf("name=")!=-1)
	{	var strpos=element.indexOf("name=");
		strpos=strpos+5;
		var endpos=element.indexOf("]", strpos);
		
		element="#"+element.substring(strpos, endpos); 
		element=replaceAll("'","",element);
	}
	var local_things_to_check	= arr_things_to_check;	
	jQuery(""+element).on(""+action, 
	function(e)
	{ 	jQuery.globalEval("(function() {" +callback.replace(/.val\(\)/g, '.fmval()')+ ";})()");		
	});
}

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function set_to_check()
{	var tmp;
	tmp=things_to_check.split("|");
	tmp=jQuery.unique(tmp);
	tmp=jQuery.grep(tmp,function(n){ return(n) });
	arr_things_to_check=tmp;		
}

function manObjToStr(text) 
{	text = text.replace(/\[{/g, '');
	text = text.replace(/\}]/g, '');
	text = text.replace(/{/g, '');
	text = text.replace(/}/g, '');
	text = text.replace(/"/g, '');
	text = text.replace(/:/g, '|');
	text = text.replace(/,action/g, '*action');
	text = text.replace(/,/g, '|');
	text = text.replace(/\*/g, ',');
	text = text.replace(/\|input/g, ',input');
	text = text.replace(/\|#/g, ',#');
	text = text.replace(/hide,/g, 'hide|');
	text = text.replace(/show,/g, 'show|');
	text = text.replace(/\]condition/g, '],condition');
	return text;
}

function objToStr(o,delim) 
{   if (/^(string|boolean|number)$/.test(typeof o)) return o;
    delim = delim || '&'; // delimiter
    var arr = [], isArray = true;
    for (var j in o) {
        if (isNaN(parseInt(j))) { isArray = false; break; }
    }
    if (isArray) {
        for (var j in o) arr[j] = objToStr(o[j],delim);
        return arr.join(',');
    }
    for (var j in o) {
        if (typeof o[j] != 'object') arr.push(j+'|'+o[j]);
        else arr.push(j+'|'+objToStr(o[j],delim));
    }
    return arr.join(delim);
}

function findMatch (obj, match) 
{	var asString =obj.join();
	if(asString.indexOf(match) != -1)
	{	return asString.indexOf(match);
	}
	else
	{	return -1;
	}
}

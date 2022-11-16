String.prototype.reverse = function () {
    return this.split('').reverse().join('');
};
String.prototype.replaceLast = function (what, replacement) {
    return this.reverse().replace(new RegExp(what.reverse()), replacement.reverse()).reverse();
};

String.prototype.hashCode = function(){
    var hash = 0;
    for (var i = 0; i < this.length; i++) {
        var character = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

var option_types = new Array("select", "radiobuttons", "checkboxes");
var rulecount=0;
var optioncount=0;
var processingrulecount=0;
var active_qs_questions="";
var unrequired=[];
var rules_loaded=false;
var elem_en_option_count=0;
var elem_cy_option_count=0;
var ich;
var system_name=null;
var application=null;
var to_process=[];
var checkedValues="";
var all_folloup_rules=[];
var final_folloup_rules=[];
var filter_cookie_name=null;
	jQuery.fn.sort_select_box = function(){
    // Get options from select box
    var my_options = jQuery("#" + this.attr('id') + ' option');
    // sort alphabetically    
    my_options.sort(function(a,b){ 
        return parseInt(a.value) > parseInt(b.value) ? 1 : -1; 
    })
   //replace with sorted my_options;
   jQuery(this).empty().append( my_options );
   // clearing any selectionsevent.preventDefault();
   jQuery("#"+this.attr('id')+" option").attr('selected', false);
}

jQuery( document ).ready(function() 
{	curr_uri=window.location.href;
	if(curr_uri.indexOf('form-manager')!=-1)
	{	application='form-manager';
	}
	else
	{	application='ethics';
	}
	FixSwitcher();
	/*if(jQuery('#form-rule-init').length)
	{	jQuery.getScript( "/formbuilder-assets/js/form_rules.js" )
		.done(function( script, textStatus ) {
			var json= window.form_rule;
			json = json.replace(/&(lt|gt|quot);/g, function (m, p) { 
						return (p == "lt")? "<" : (p == "gt") ? ">" : '"';
					});
			parseData(json);  
		})
	}*/
	if(!((jQuery('.departmental-x-switchover').length > 0) || (jQuery('.departmental-x-corporate').length > 0)))
	{	jQuery('<link rel="stylesheet" type="text/css" media="all" href="/formbuilder-assets/css/snow-white-additional.css">').appendTo("footer");
	}
	if (jQuery('.form-wymeditor').length > 0)
	{	init_wym();
	}
	
	if (jQuery('#app_setup_wizard_1').length > 0)
	{	jQuery('input[name=structured]').on("change", function (){
				type=jQuery('input[name=structured]:checked').val();
				if(type==1)
				{	jQuery("#step_names").addClass("has-steps");
					number_of_forms=jQuery("#Application_num_questionsets").val();
					counter=1;
					while(counter<=number_of_forms)
					{	add_step_row(counter);
						counter=counter+1;
					}
					jQuery("#link_them").removeClass("hidden");
					
				}
				else
				{	jQuery("#step_names").empty();
					jQuery("#step_names").removeClass("has-steps");
					jQuery("#link_them").addClass("hidden");
				}			
		});
		jQuery("#Application_num_questionsets").on("change", function(){
				if(jQuery("#step_names").hasClass("has-steps"))
				{	counter=0;
					jQuery(".step-line").each(function(){
						counter=counter+1;
						if(counter>jQuery("#Application_num_questionsets").val())
						{	jQuery(this).remove();
						}	
					});
					
					if(counter<=jQuery("#Application_num_questionsets").val())
					{	while(counter<jQuery("#Application_num_questionsets").val())
						{	counter=counter+1;
							add_step_row(counter);
							
						}
					}
				}
				
		});
	}
	if (jQuery('#follow-up-message').length > 0)
	{	$("#add-message").on("click", function(event){
			event.preventDefault();
			jQuery("#follow-up-message-area").removeClass("hidden");
			jQuery("#add-message").addClass("hidden");
		});
		$("#remove-message").on("click", function(event){
			event.preventDefault();
			jQuery("#remove").val("remove");
			
			jQuery("#remove-message").addClass("hidden");
			jQuery("#form-inner").addClass("hidden");
			jQuery("#submit-button").val("Confirm Message Removal");
		});
	}
	if (jQuery('#show_questionsets').length > 0)
	{	var all_apps_info=window.setup_application_list();
		//console.log(all_apps_info);
		//all_apps_info = all_apps_info.filter(function(v){return v!==''});
		//console.log(all_apps_info);
		var type_labels={public:"Public Singular Forms", restricted:"Portal Singular Forms"};
		var qs_types=new Array;
		var qs_applications=new Array;
		var filters={"":"all"};
		options="";
		options=options+createSelectOption("", "all");
		jQuery('.qs-listing-table tbody tr').each(function(){
				if($(this).attr("data-type"))
				{	if( qs_types.indexOf($(this).attr("data-type")) ==-1)
					{	qs_types.push($(this).attr("data-type"));
					}
				}
				if($(this).attr("data-application"))
				{	if( qs_applications.indexOf($(this).attr("data-application")) ==-1)
					{	qs_applications.push($(this).attr("data-application"));
					}
				}
		});
		jQuery.each(qs_types, function(key, value){			
			if(value!==null)
			{	options=options+createSelectOption("type-"+value, "Type: "+type_labels[value]);
				//filters["type-"+value]="Type: "+type_labels[value];
			}
		});
		
		jQuery.each(qs_applications, function(key, value){
			if(all_apps_info[value]!==undefined)
			{	options=options+createSelectOption("application-"+value, "Application: "+all_apps_info[value]);
				//filters["application_id-"+value]="Application: "+all_apps_info[value];
			}
		});
		jQuery("#filter-bar").append("<label>Show:</label> <select id='questionset-filter'>"+options+"</select>");
		filter_cookie_name="qsfilter";
		
		if(window.curr_user!=="")
		{	filter_cookie_name=window.curr_user+"-qsfilter";
		}
		
		var filter = getCookie(filter_cookie_name);
		if (filter != "") {
			jQuery("#questionset-filter option[value='"+filter+"']").attr("selected", "selected");
			setFilter();
		}
		jQuery("#questionset-filter").on("change", function(){			
			if(jQuery("#questionset-filter").val()=="")
			{	setCookie(filter_cookie_name, "", 2);
				jQuery('.qs-listing-table tbody tr').each(function(){
					jQuery(this).removeClass("hidden");
				});
			}
			else
			{	setFilter();
			}			
		});

	}
	
	if (jQuery('#form-area').length > 0)
	{	var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
		var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
		if(isChrome || isSafari)
		{	jQuery('#main').addClass("webkit");
		}
		if(window.location.hostname=="notaber.ac.uk")
		{	jQuery('#main').addClass("dev");
		}
		
	}
	/*if ((jQuery('#form-area').length > 0) && (gdpr_mode=="active"))
	{	setTimeout("init_gdpr_enforcement();",1000);
	}*/
	if (jQuery('#question-search').length)
	{	jQuery("#questionsearch").on("change keyup keydown", function(){
			jQuery("#questionchooser2 > option").each(function() {
				jQuery(this).addClass('hidden');
				qsText=jQuery(this).attr('data-questiontext');
				match=jQuery("#questionsearch").val().toLowerCase();
				if(qsText.indexOf(match) != -1 && match.length>2)
				{	jQuery(this).removeClass('hidden');
				}
			});
		});
	}
	if (jQuery('#element-search').length)
	{	jQuery("#elementsearch").on("change keyup keydown", function(){
			jQuery("#elementchooser2 > option").each(function() {
				jQuery(this).addClass('hidden');
				qsText=jQuery(this).attr('data-elementstext');
				match=jQuery("#elementsearch").val().toLowerCase();
				if(qsText.indexOf(match) != -1 && match.length>2)
				{	jQuery(this).removeClass('hidden');
				}
			});
		});
	}
	if(jQuery('#Questionset_supporting_documents').length)
	{	check_supporting_documents();
		jQuery('#Questionset_supporting_documents').on("change", function(){
			check_supporting_documents();
		});
	}
	if (jQuery('#results-listing').length)
	{	jQuery('.timepicker').each(function(){
			//console.log("exists");
			jQuery(this).timepicker({ 'timeFormat': 'H:i:s' });
		});
	}
	if (jQuery('#fullform').length)
	{	setTimeout("remove_duplicate_headers()", 200);
	}
	if (jQuery('#element-add-form').length)
	{	element_option();
	}
	if (jQuery('#element-form').length)
	{	element_option();
	}
/*	if (jQuery('#element-add-form').length)
	{	jQuery('#Element_type').change(function(){
			element_type_toggle();
		});
	}*/
	if (jQuery('#admin_accept_reject').length)	
	{	admin_accept_reject();
	}
	if (jQuery('.mod-toolbar').length)	
	{	moderation_tools();
	}
	if (jQuery('.entity-hoverable').length)	
	{	init_entity_hover();
	}
	if (jQuery('#entity-update-form').length)	
	{  get_entity_fullname();
		jQuery('#entity_abbr_name').keyup(function () {get_entity_fullname();});
	}	
	if (jQuery('#entity-add-form').length)	
	{ 	jQuery('#entity_abbr_name').keyup(function () {get_entity_fullname();});
	}
		
	if(jQuery('#flag-form').length)
	{	if(jQuery('input.color-picker').length)
		{	load_color_picker();
			setTimeout('init_color_picker();',100);
		}		
		jQuery('#Flags_type').change(function(){
			
			jQuery('.colorhide').each(function(){
				jQuery(this).addClass('hidden');
			});
			
			if(jQuery(this).val()=="display")
			{	jQuery('.colorhide').each(function(){
					jQuery(this).removeClass('hidden');
				});
			}
		});
	}
	if(jQuery('#followup-add-form').length>0)
	{	followupWizard();
	}
	if(jQuery('#js_rule_generator').length>0)
	{	system_name=system;
		
		jQuery.getScript( "/formbuilder-assets/js/ICanHaz.js/ICanHaz.min.js" ).done(function( script, textStatus ){
			//console.log(ich);
			grab_rule_templates();					
		
			jQuery('#js_add_rule').click(function(event) 
			{	event.preventDefault(); 
				event.stopPropagation();
				js_rule_add();
			});  
			jQuery('#js_add_processing_rule').click(function(event) 
			{	event.preventDefault(); 
				event.stopPropagation();
				js_processing_rule_add();
			});
		});  
		if(jQuery('#finalrules').val()!="")
		{	rules_from_db();
		}   
		if(jQuery('#finalprocessingrules').val()!="")
		{	processing_rules_from_db();
		}   
	}
	if (jQuery('#Questionbank_type').length){
        toggle_options();
		jQuery('#Questionbank_type').change(function() {
			toggle_options();
	});
    }    
	if(jQuery('#routes_builder').length!=0)  
	{	jQuery.getScript( "/formbuilder-assets/js/ICanHaz.js/ICanHaz.js" )
		.done(function( script, textStatus ) 
		{	if(jQuery("#finalroute").val()=="")
			{	setup_routes_builder();
			}
			else
			{	populate_route_from_db();
			}
		});
	}
	if(jQuery('#questionbank-add-form').length)
	{	if(jQuery('#sql_settings').length!=0 )
		{	jQuery('#sql_settings').addClass("hidden");
			jQuery('#Questionbank_options_use_sql_query').change(function() {
				if(jQuery(this).is(":checked")) {
					$("#nice_options").addClass("hidden");
					$("#sql_hide").addClass("hidden");
					jQuery('#sql_settings').removeClass("hidden");
				}
				else{
					$("#nice_options").removeClass("hidden");
					$("#sql_hide").removeClass("hidden");
					jQuery('#sql_settings').addClass("hidden");
				}
			});
		}      
		
		build_validation_rule();
		
		jQuery('#Questionbank_options_use_abbr').change(function() {
			if(jQuery(this).is(":checked")) {
				nicer_options_abbr();
			}
			else
			{    nicer_options_trans();
			}
		});
	}
	if(jQuery('#questionbank-form').length)
	{	build_validation_rule();
		
		if(jQuery('#Questionbank_options_use_abbr').is(':checked') )
		{	nicer_options_abbr();
		}
		else
		{	nicer_options_trans();
		}
		
		
		jQuery('#Questionbank_options_use_abbr').change(function() {
			if(jQuery(this).is(":checked")) {
				nicer_options_abbr();
			}
			else
			{    nicer_options_trans();
			}
		}); 		
		if(jQuery('#sql_settings').length!=0 ){
			jQuery("#Questionbank_type").on("change", function(){
				jQuery("#Questionbank_options_use_sql_query").trigger("change");
			});
			if(jQuery('#Questionbank_options_use_sql_query').is(":checked")) {
				$("#nice_options").addClass("hidden");
				$("#sql_hide").addClass("hidden");
				jQuery('#sql_settings').removeClass("hidden");
			}
			else{
				$("#nice_options").removeClass("hidden");
				$("#sql_hide").removeClass("hidden");
				jQuery('#sql_settings').addClass("hidden");
			}
			
			jQuery('#Questionbank_options_use_sql_query').change(function() {
				if(jQuery(this).is(":checked")) {
					$("#nice_options").addClass("hidden");
					$("#sql_hide").addClass("hidden");
					jQuery('#sql_settings').removeClass("hidden");
				}
				else{
					$("#nice_options").removeClass("hidden");
					$("#sql_hide").removeClass("hidden");
					jQuery('#sql_settings').addClass("hidden");
				}
			});
		}		
	}
	if(jQuery('#questionbank_validation').length)
	{		
		jQuery('#min-size-d').addClass('hidden');
		jQuery('#max-size-d').addClass('hidden');
		jQuery('#setvalidtype').change(function() {
				jQuery('#min-size-d').addClass('hidden');
				jQuery('#max-size-d').addClass('hidden');			
				var curVal=jQuery('#setvalidtype').val();
				switch(curVal){
					case "minlength":
						jQuery('#min-size-d').removeClass('hidden');
						break;
					case "maxlength":
						jQuery('#max-size-d').removeClass('hidden');
						break;
					case "rangelength":
						jQuery('#min-size-d').removeClass('hidden');
						jQuery('#max-size-d').removeClass('hidden');	
						break;
					default:
						jQuery('#min-size-d').addClass('hidden');
						jQuery('#max-size-d').addClass('hidden');
						break;
				}
				build_validation_rule();
			});
		jQuery('#questionbank_validation input').change(function() {
			build_validation_rule();
		});
	}
	if(jQuery('#show_element').length)
	{	catTabs("element");
	}
	if(jQuery('#followup-rules-container').length)
	{	followup_setup();
	}
    if (jQuery('#show_question').length)
	{	catTabs("question");		
	}
    if (jQuery('#questionset-builder').length)
	{	jQuery("#operations").addClass("hidden");
		jQuery("#au-accordion.settings-pane").addClass("hidden");
		jQuery("#history").addClass("hidden");
		jQuery("#Application_id").on("change", function(){
			if(jQuery("#Application_id").val()!="" && jQuery("#Questionset_custom_submission_controller").val()=="")
			{	 jQuery("#Questionset_custom_submission_controller").val("multiform");
				 jQuery("#Questionset_custom_submission_controller").attr("data-altered-by-js", "true");
			}
			if(jQuery("#Application_id").val()=="" && jQuery("#Questionset_custom_submission_controller").attr("data-altered-by-js")=="true"  && jQuery("#Questionset_custom_submission_controller").val()=="multiform")
			{	 jQuery("#Questionset_custom_submission_controller").val("");
			}
		});
		make_tabs();
		make_tabs2();
		add_toolbar_links();
		add_view_toolbar_links();
		set_from_cookie('questionset_design', 'question');
		var show_cats= get_checked_categories("question");
		question_filter(show_cats, '#questionchooser option');
		
		set_from_cookie('element_design', 'element');
		var show_cats= get_checked_categories("element");
		question_filter(show_cats, '#elementchooser option');
		
		if(jQuery('#nonrequired').val()!="")
		{	unrequired=jQuery('#nonrequired').val().split(',');
		}
		//console.log(unrequired);
		jQuery('#formbuild').change(function() {
			clear_design_question_setting()
		});
		jQuery('#formbuild').on("dblclick", "option",function() {
			var clickedOption = jQuery(this).val();	
			var type="";
			if(jQuery(this).hasClass('question-item') && jQuery(this).attr("data-status")=="unlocked")
			{	type="questionbank";
			}			
			if(jQuery(this).hasClass('element-item'))
			{	type="element";
			}			
			if(type!="")
			{	edit_it(type, clickedOption);
			}
		});
		jQuery('#formbuild').on("click keyup", "option",function() {
			var is_question=false;
			var is_element=false;
			var is_locked=true;
			var is_always_required=false;
			if(jQuery(this).hasClass('question-item'))
			{	is_question=true;
				if(jQuery(this).hasClass('always-required'))
				{	is_always_required=true;					
				}
			}
			if(jQuery(this).hasClass('element-item'))
			{	is_element=true;
			}
			//console.log(jQuery(this).attr('data-status'));
			if(jQuery(this).attr('data-status')=="unlocked")
			{	is_locked=false;
			}
			var clickedOption = jQuery(this).val();	
			if(is_question==true)				
			{	questionset_field_details(clickedOption, is_question, is_locked, is_always_required);
			}
			if(is_element==true)				
			{	questionset_element_details(clickedOption, is_question, is_locked);
			}
			
		});
		jQuery('#question-categories input').click(function() {
			var show_cats= get_checked_categories("question");
			question_filter(show_cats, '#questionchooser option');
			store_to_cookie('questionset_design',show_cats);
		});
		
		jQuery('#element-categories input').click(function() {
			var show_cats= get_checked_categories("element");
			question_filter(show_cats, '#elementchooser option');
			store_to_cookie('element_design',show_cats);
		});
		jQuery('#cat-select-none').click(function(){
			jQuery('#question-categories input').each(function(){
				jQuery(this).removeAttr('checked');
			});
			var show_cats= get_checked_categories("question");
			question_filter(show_cats,'#questionchooser option');
			store_to_cookie('questionset_design',show_cats);
		});
		jQuery('#cat-select-all').click(function(){
			jQuery('#question-categories input').each(function(){
				jQuery(this).attr('checked', 'checked');
			});
			var show_cats= get_checked_categories("question");
			question_filter(show_cats,'#questionchooser option');
			store_to_cookie('questionset_design',show_cats);
		});
		
		jQuery('#element-cat-select-none').click(function(){
			jQuery('#element-categories input').each(function(){
				jQuery(this).removeAttr('checked');
			});
			var show_cats= get_checked_categories("element");
			question_filter(show_cats,'#elementchooser option');
			store_to_cookie('element_design',show_cats);
		});
		
		jQuery('#element-cat-select-all').click(function(){
			jQuery('#element-categories input').each(function(){
				jQuery(this).attr('checked', 'checked');
			});
			var show_cats= get_checked_categories("element");
			question_filter(show_cats,'#elementchooser option');
			store_to_cookie('element_design',show_cats);
		});

		
		if (jQuery('#tosave').val().length!=0)	
		{  load_from_db();
		}		
		/*jQuery('.build-action').each(function(){
			jQuery(this).on("click", function(){
				setTimeout("check_gdpr_compliance();", 50);
			});
		});*/
		jQuery('#add_questions').click(function() {  			
			return !jQuery('#questionchooser option:selected').remove().appendTo('#formbuild');  
		});  
		jQuery('#add_questions2').click(function() {  
			jQuery('#questionchooser2 option:selected').each(function(){
				val=jQuery(this).val();
				jQuery('#questionchooser option[value='+val+']').removeClass('hidden');
				jQuery('#questionchooser option[value='+val+']').prop('selected', true);
			});
			return !jQuery('#questionchooser option:selected').remove().appendTo('#formbuild');  
		});  
		jQuery('#add_elements').click(function() {  
			return !jQuery('#elementchooser option:selected').remove().appendTo('#formbuild');  
		});  
		jQuery('#add_elements2').click(function() {  
			jQuery('#elementchooser2 option:selected').each(function(){
				val=jQuery(this).val();
				jQuery('#elementchooser option[value='+val+']').removeClass('hidden');
				jQuery('#elementchooser option[value='+val+']').prop('selected', true);
			});
			return !jQuery('#elementchooser option:selected').remove().appendTo('#formbuild'); 
		});  
		jQuery('#questionchooser option').dblclick(function() {  
			 jQuery('#add_questions').trigger("click");
		});  
		jQuery('#elementchooser option').dblclick(function() {  
			jQuery('#add_elements').trigger("click");
		});  
		jQuery('#formbuild').blur(function() {
		   gen_to_save();
		});
		jQuery('#formbuild').focus(function() {
		   gen_to_save();
		});
		jQuery('#formbuild').mouseenter(function() {
		   gen_to_save();
		});
		jQuery('#formbuild').mouseleave(function() {
		   gen_to_save();
		});		   
		jQuery('#remove').click(function() {  
			//return !jQuery('#formbuild option:selected').remove().appendTo('#questionchooser');  
			jQuery('#formbuild option:selected').each(function(){
				if (jQuery(this).hasClass("question-item"))
				{	!jQuery(this).remove().appendTo('#questionchooser'); 
					jQuery("#questionchooser").sort_select_box();
					var show_cats= get_checked_categories("question");
					question_filter(show_cats, '#questionchooser option');
				}
				else
				{	!jQuery(this).remove().appendTo('#elementchooser');
					jQuery("#elementchooser").sort_select_box();
				}	
			});				
		});  
		jQuery('.build-action').click(function() {  
		gen_to_save();
		});
		jQuery("#Questionset_custom_message").change(function(){
			jQuery("#message-info").removeClass("hidden");
			jQuery("#mail_message-info").removeClass("hidden");
			jQuery(".message-group-header").each(function(){
				jQuery(this).addClass("hidden");
			});
			if(jQuery("#Questionset_custom_message").val()=="0")
			{	jQuery("#message-info").addClass("hidden");	
				jQuery("#mail_message-info").addClass("hidden");
			}
			if(jQuery("#Questionset_custom_message").val()=="1")
			{	jQuery("#mail_message-info").addClass("hidden");
			}
			if(jQuery("#Questionset_custom_message").val()=="2")
			{	jQuery("#mail_message-info").removeClass("hidden");
				jQuery(".message-group-header").each(function(){
					jQuery(this).removeClass("hidden");
				});
			}
		});
		jQuery("#Questionset_custom_message").trigger("change");
	}   
	if( typeof make_fullwidth !== 'undefined' )
	{	jQuery("#nav").remove();
		jQuery("#wrap").removeClass("normal");
		jQuery("#wrap").addClass("vod");
	}
    jQuery('.move').click(function(){
        var jQueryop = jQuery('#formbuild option:selected'),
        jQuerythis = jQuery(this);
        if(jQueryop.length){
            (jQuerythis.attr('id') == 'up') ? 
                jQueryop.first().prev().before(jQueryop) : 
                jQueryop.last().next().after(jQueryop);
        }
    });    
    if(jQuery("#form-toolbar").length>0)
    {	form_options_txt="Form Options";
		resume_later_txt="Resume Later";
		lang=getLang();
		if(lang=="cy")
		{	form_options_txt="Dewisiadau Ffurflen";
			resume_later_txt="Ailymafel cyn bo hir";
		}
		$("#application_resume_dismiss_button").on("click", function(event){
			event.preventDefault();
			$("#application-dialog").addClass("hidden");
		});
		$("#form-toolbar").append("<ul id='form-menu' class='drop_menu'><li><a href='#'>"+form_options_txt+"</a><ul><li><a href='#' id='form_resume'>"+resume_later_txt+"</a></li></li></ul>");
		$("#form-menu a").each(function(){
			id_attr=$(this).attr('id');
			if (typeof id_attr !== typeof undefined && id_attr !== false) {
					$(this).on("click", function(event){
					event.preventDefault();
				});
			}
		});
		$("a#form_resume").on("click", function(event){
				event.preventDefault();
				$("#application-dialog").removeClass("hidden");
		});
		$("#to_email").on("blur", function(){
			generate_resume_pin();
		});
		$("#to_email_button").on("click", function(){
			generate_resume_pin();
		});
	}	
    if(jQuery("#progressbar").length>0)
    {	/*found_active=0
		jQuery("#progressbar li").each(function(){
			if($(this).hasClass('active'))
			{	found_active=1;
			}
			else{
				if(found_active==0)
				{	$(this).addClass("before-active");
				}
				if(found_active==1)
				{	$(this).addClass("after-active");
				}
			}
		});
		jQuery("#progressbar li.before-active").each(function(){
			jQuery(this).append("✔");
		});*/
	}
	//setTimeout("FixSwitcher();", 50);
}); 

function setFilter()
{	filter_val=jQuery("#questionset-filter").val();
	setCookie(filter_cookie_name, filter_val, 2);
	val_parts=filter_val.split("-");
	jQuery('.qs-listing-table tbody tr').each(function(){
		jQuery(this).addClass("hidden");
		if(jQuery(this).attr("data-"+val_parts[0])==val_parts[1])
		{	jQuery(this).removeClass("hidden");
		}
	});
}

function buildRoute()
{	var cur_count=jQuery("#rowcount").val();
	var build=[];
	var loop=1;
	while (loop <= cur_count)
	{	var max=5;
		var innerloop=1;
		while (innerloop <=max)
		{	if (jQuery('#questionsetchooser-'+loop+'-'+innerloop).length)
			{	var qs_val=jQuery('#questionsetchooser-'+loop+'-'+innerloop).val();
				build.push("{'qs':"+qs_val+", 'level':"+loop+", 'position':"+innerloop+"}");
				//console.log('questionsetchooser-'+loop +'-'+ innerloop+' exists');
			}
			innerloop=innerloop+1;
		}		
		loop=loop+1;
	}
	jQuery("#finalroute").val(build.toString());
//	var final_route=jQuery("#temproute").val();
	//final_route = '{"route":['+ final_route +']}';
	//final_rule=encodeURIComponent(final_route);
	//jQuery("#finalroute").val(final_route);
	jQuery('#buildbutton').addClass("hidden");
	var build_success="<div id='buildSuccess'><p class='green'>Route build successful!</p><p>Press 'Submit' to save, or <a onClick='rebuildRoute()'>click here</a> to rebuild route</p></div>";
	jQuery('#buildconfirm').append(build_success);
	jQuery('#operations').removeClass("hidden");
	
}

function init_gdpr_enforcement()
{	jQuery(".message-container").each(function(){
		jQuery(this).addClass("active");
	});
	if(jQuery("#category-5").length>0)
	{	jQuery("#category-5").append("<button id='admin-gdpr-override' type='button'>I'm an Admin - Let me save without GDPR requirements</button>");
		jQuery("#admin-gdpr-override").on("click", function(){
			jQuery(':input[type="submit"]').removeAttr('disabled');
		});
	}
	check_gdpr_compliance();

}

function check_supporting_documents()
{	jQuery('#supporting_docs_intros').removeClass("hidden");
	if(jQuery('#Questionset_supporting_documents').val()=="0")
	{	jQuery('#supporting_docs_intros').addClass("hidden");
	}
	if(jQuery('#Questionset_supporting_documents').val()=="1")
	{	if(jQuery('#Questionset_supporting_documents_submission_email').val()=="")
		{	if(jQuery('#override_email').val()!="")
			{	jQuery('#Questionset_supporting_documents_submission_email').val(jQuery('#override_email').val());
			}
		}
	}
}
function check_gdpr_compliance()
{	number_of_items=$("#form-area option").length;
	app_id=jQuery("#Application_id").val();
	gdpr_message="";
	if(number_of_items>0 & app_id=="")
	{	
		number_of_gdpr_questions=$("#form-area option.cat-3").length
		number_of_gdpr_elements=$("#form-area option.cat-4").length
		if(number_of_gdpr_questions==0)
		{ gdpr_message=gdpr_message+"Your form must carry at least one agreement from the 'GDPR Agreement' question category <br />";
		}
		if(number_of_gdpr_elements==0)
		{ gdpr_message=gdpr_message+"Your form must carry at least one statement from the 'GDPR Information Statements' elements category<br />";
		}
		gdpr_present=number_of_gdpr_elements+number_of_gdpr_questions;
		if(number_of_gdpr_questions==0 || number_of_gdpr_elements==0)
		{	gdpr_message=gdpr_message+"You will not be able to save form changes until you have added the above<br />";
			jQuery(':input[type="submit"]').attr('disabled', 'disabled');
		}
		else
		{	jQuery(':input[type="submit"]').removeAttr('disabled');
		}
	}
	else if(number_of_items>0 & app_id!=="")
	{	gdpr_message="As your form is part of an application we cannot programatically force GDPR agreements and statements<br>However, for compliance reasons you should insure that these appear in least one of the forms in your multi-form application";
	}
	
	$(".message-container").html(gdpr_message);
	
}

function rebuildRoute()
{	jQuery('#buildSuccess').remove();
	jQuery('#buildbutton').removeClass("hidden");
	jQuery('#operations').addClass("hidden");
	jQuery("#finalroute").val('');
}
function setup_routes_builder()
{	jQuery("#operations").addClass("hidden");
	rulecount=1;
	js_rule_build_generator();		
	setTimeout("ich.grabTemplates();addRouteBuildRow(rulecount);addFirstRouteBuildRule(rulecount)",100);
}

function addFirstRouteBuildRule(id)
{	secondary_count=3;
	RouteElemAdd(id, secondary_count);
	rulecount=id+1;	
}

function do_save()
{	jQuery("#savechanges").trigger("click");
}

function show_design_view()
{	jQuery("#top-toolbar").removeClass('hidden');
	jQuery("#design-area").removeClass('hidden');
	jQuery(".settings-pane").addClass('hidden');
	jQuery("#history").addClass('hidden');
	jQuery("#design-tab").addClass('active');
	jQuery("#settings-tab").removeClass('active');
	jQuery("#history-tab").removeClass('active');
	
}
function show_settings_view()
{	jQuery("#top-toolbar").addClass('hidden');
	jQuery("#design-area").addClass('hidden');
	jQuery(".settings-pane").removeClass('hidden');
	jQuery("#history").addClass('hidden');
	jQuery("#design-tab").removeClass('active');
	jQuery("#settings-tab").addClass('active');
	jQuery("#history-tab").removeClass('active');
}
function show_history_view()
{	jQuery("#top-toolbar").addClass('hidden');
	jQuery("#design-area").addClass('hidden');
	jQuery(".settings-pane").addClass('hidden');
	jQuery("#history").removeClass('hidden');
	jQuery("#design-tab").removeClass('active');
	jQuery("#settings-tab").removeClass('active');
	jQuery("#history-tab").addClass('active');
}

function catTabs(type)
{	
	var shortname="";
	var longname="";
	var cookiename="";
	if(type=="question")
	{	shortname="question";
		longname="questionbank";
		cookiename='question_list';
	}
	if(type=="element")
	{	shortname="element";
		longname="element";	
		cookiename='element_list';
	}	
	//alert(cookiename);
	make_tabs();
	var selected_for_batch=[];
	set_from_cookie(cookiename, type);
	var show_cats= get_checked_categories(type);
	question_filter(show_cats, '#'+longname+'_listing tbody tr');
	activate_selectall();
	jQuery('.selectforbatch').change(function()
	{	if (jQuery(this).is(':checked'))
		{	if(selected_for_batch.indexOf!=-1)
			{	selected_for_batch.push(jQuery(this).attr('id'));
			}
		}
		else
		{	if(selected_for_batch.indexOf!=-1)
			{	var elem =jQuery(this).attr('id');
				var i = jQuery.inArray(elem,selected_for_batch);
				if (i >= 0)
				{	selected_for_batch.splice(i, 1);
				}
			}
		}
		selected_for_batch = selected_for_batch.filter(function(elem, pos) 
		{	return selected_for_batch.indexOf(elem) == pos;
		})
		jQuery('#checkedlist').val(selected_for_batch.join(","));
	});
	jQuery('#'+shortname+'-categories input').click(function() {
		var show_cats= get_checked_categories(type);
		question_filter(show_cats, '#'+longname+'_listing tbody tr');
		store_to_cookie(cookiename,show_cats);
	});
	jQuery('#cat-select-none').click(function(){
		jQuery('#'+shortname+'-categories input').each(function(){
			jQuery(this).removeAttr('checked');
		});
		var show_cats= get_checked_categories(type);
		question_filter(show_cats,'#'+longname+'_listing tbody tr');
		store_to_cookie(cookiename,show_cats);
	});
	jQuery('#cat-select-all').click(function(){
		jQuery('#'+shortname+'-categories input').each(function(){
			jQuery(this).attr('checked', 'checked');
		});
		var show_cats= get_checked_categories(type);
		question_filter(show_cats,'#'+longname+'_listing tbody tr');
		store_to_cookie(cookiename,show_cats);
	});
}

function activate_selectall()
{	jQuery('#selectall').change(function()
	{	if (jQuery(this).is(':checked'))
		{	jQuery('.selectforbatch').each(function(){
				if(jQuery(this).closest('tr').hasClass('hidden')==false)
				{	jQuery(this).attr("checked", "checked");	
					selected_for_batch.push(jQuery(this).attr('id'));											
				}
			});
		} 
		else
		{	jQuery('.selectforbatch').each(function(){
				jQuery(this).removeAttr("checked");	
				selected_for_batch=[];				
			});
		}
		selected_for_batch = selected_for_batch.filter(function(elem, pos) 
		{	return selected_for_batch.indexOf(elem) == pos;
		})
		jQuery('#checkedlist').val(selected_for_batch.join(","));
	});

}

function RouteElemAdd(id, secondary_count)
{	var qsc=jQuery("#questionsetchooser").clone().prop({ id: "questionsetchooser-"+id+'-'+secondary_count, name: "questionsetchooser-"+rulecount+'-'+secondary_count});
	jQuery('#route-row-part-'+id+'-'+secondary_count).append(qsc);
}
function addRouteBuildRow(count)
{	data = {id: count,};
	html = ich.routebuildrow(data);
	jQuery('#builderforroutes').append(html); 
	jQuery("#rowcount").val(count+1);
}

function RouteRowAdd(count, check)
{	if(check == 'undefined')
	{	check=false;
	}
	if(check==true)
	{	count=count-1;
		if(count==0)
		{	count=1;
		}
		//console.log("called "+count);
		var tmp_count=count+1;
		if(!jQuery("#route-row-part-"+tmp_count+"-1").length)
		{	count++;
			addRouteBuildRow(count);	
		}
	}
	else
	{	count++;
		addRouteBuildRow(count);
	}
}

function populate_route_from_db()
{	var load=jQuery("#finalroute").val();
	load=load.trim();

	load=replaceAll("},{", "}*{",load);
	var pairs=load.split("*");
//console.log(pairs);
	var count=0;
	var pair_set=[];	
	jQuery.each(pairs, function(key, value){
		value=replaceAll("'", '"', value)
		pair=jQuery.parseJSON(value.trim() );
		pair_set.push(pair);
	});
	jQuery.each(pair_set, function(key, value){
		if(count==0)
		{	setup_routes_builder();			
		}
		else
		{	var row =pair_set[key]['level'];
			//console.log("row= "+row);
			setTimeout("RouteRowAdd("+row+", true);RouteElemAdd("+pair_set[key]['level']+","+pair_set[key]['position']+")",130);
		}
		var elem_name="#questionsetchooser-"+pair_set[key]['level']+"-"+pair_set[key]['position'];
			var interval = setInterval(function () {
				if (jQuery(elem_name).length) 
				{	clearInterval(interval);
					select_set_value("questionsetchooser", pair_set[key]['level'], pair_set[key]['position'], pair_set[key]['qs']);
				}
			}, 20);
		count = count+1;	
	});
}

function select_set_value(name, level, position, setValue)
{	//console.log("value: "+setValue);
	var elem_name="#"+name+"-"+level+"-"+position;
	//console.log(elem_name);
	jQuery(elem_name+" option[value='"+setValue+"']").attr('selected', 'selected');
	//console.log("called");
}

function grab_rule_templates()
{	js_rule_action_generator();
	js_rulepart_generator();
	questionset_actionpart_generator();
	logicset_actionpart_generator();
	setTimeout("grab_templates();",300);		
}

function grab_templates()
{	
	ich.grabTemplates();
	//console.log(ich);
}

function add_to_formbuild(active_qs_questions)
{	var available=jQuery.parseJSON(active_qs_questions);
	jQuery.each(available, function(key, value){
		jQuery("#formbuild").append('<option title="'+value['name']+'" value="'+value['id']+'" class="question-item '+value['type']+'" selected="selected">'+value['caption']+'</option>');
		
	});
}
function toggle_options()
{	current_settings=jQuery('#Questionbank_type').val();
	if(current_settings!="select")
	{	jQuery("#Questionbank_options_use_abbr").attr('checked', false);
		jQuery("#Questionbank_options_use_abbr").change();
		nicer_options_trans();
	}
	jQuery("#opts_en").removeClass("hidden");
	jQuery("#opts_cy").removeClass("hidden");
	jQuery("#options_use_abbr").removeClass("hidden");
	if(jQuery.inArray(current_settings, option_types)==-1)
	{	jQuery("#opts_en").addClass("hidden");
		jQuery("#opts_cy").addClass("hidden");
		jQuery("#options_use_abbr").addClass("hidden");		
	}
	else
	{	if(!jQuery('#Questionbank_options_use_abbr').is(':checked') )
		{	nicer_options_trans();
		}
	}
	var validations=["text", "textarea"];
	if(jQuery.inArray(current_settings, validations)!=-1)
	{	jQuery("#questionbank_validation").removeClass("hidden");
	}
	else
	{	jQuery("#questionbank_validation").addClass("hidden");
	}
	//need to make sure we set the validation dropdown to the value that would match what has been read back to the database
	val_en=jQuery('#Questionbank_validation_en').val();
	valid_obj=JSON.parse('{'+val_en.substr(1)+'}');
	//console.log(valid_obj);
	checkvals={"email":"email", "more than":"minlength", "less than":"maxlength", "between":"rangelength", "number":"number","ucas":"ucas", "telephone":"telephone", "valid date":"date", "dateUK":"dateUK"};
	for (var k in checkvals) 
	{   if(val_en.indexOf(k)!=-1)
		{	if(checkvals[k]=="minlength" || checkvals[k]=="maxlength" )
			{	jQuery(".validation-"+checkvals[k]+" > input").val(valid_obj.validate[checkvals[k]]);
				jQuery(".validation-"+checkvals[k]+" > input").removeClass("hidden");
				container_id="#"+jQuery(".validation-"+checkvals[k]).prop("id");
				setTimeout(function(){jQuery(container_id).removeClass("hidden");build_validation_rule();}, 100);
			}
			if(checkvals[k]=="rangelength")
			{	values=valid_obj.validate[checkvals[k]];
				min=values[0];
				max=values[1];
				jQuery(".validation-minlength > input").val(min);
				jQuery(".validation-minlength > input").removeClass("hidden");
				min_container_id="#"+jQuery(".validation-minlength").prop("id");
				jQuery(".validation-maxlength > input").val(max);
				jQuery(".validation-maxlength > input").removeClass("hidden");
				max_container_id="#"+jQuery(".validation-maxlength").prop("id");
				setTimeout(function(){jQuery(min_container_id).removeClass("hidden");jQuery(max_container_id).removeClass("hidden");build_validation_rule();}, 100);
			}
			jQuery("#setvalidtype option[value='"+checkvals[k]+"']").attr('selected', 'selected');
		}
    }
    //before running build validation rules
	build_validation_rule();
}

function nicer_options_abbr()
{	jQuery("#opts_en").addClass("hidden");
	jQuery("#opts_cy").addClass("hidden");
	jQuery("#nice_options").remove();
	current_settings=jQuery('#Questionbank_type').val();
	if(jQuery.inArray(current_settings, option_types)>=0)
	{	jQuery( "<div id='nice_options' class='abbr'><h3>Options</h3></div>" ).insertBefore( "#opts_en" );
		jQuery('#nice_options h3').append('<a target="_blank" href="../../abbreviations/index/"><img title="Advanced Abbreviations Management" alt="Advanced Abbreviations Management" src="/formbuilder-assets/img/settings.png"/></a><a onclick="nicer_options_abbr();" ><img title="Refresh Abbreviations" alt="refresh categories" src="/formbuilder-assets/img/refresh.png"/></a>');
		if(jQuery('#Questionbank_options_en').val()!="")
		{	options=jQuery('#Questionbank_options_en').val();
			options=options.split("*");	
			optioncount=options.length;	
			jQuery.each(options, function( index, value ) {
				jQuery('#nice_options').append('<input  class="en" type="text" id="option-'+index+'" value="'+value+'"/>');				
				jQuery('#nice_options').append('<span id="option-'+index+'-val"/>');
				jQuery('#nice_options').append('<span class="clearfix"/>');
				the_val=value.toLowerCase();
				
				jQuery.getJSON("/en/form-manager/abbreviations/json?abbr="+the_val, function(){
					format: "json"
				}).done(function( data ) {
					the_id='option-'+index;
					if (jQuery.isEmptyObject(data))
					{	jQuery('#'+the_id+'-val').html('no matching abbreviation found - <a id="'+the_id+'-add">Add one</a>');								
						jQuery('#'+the_id+'-add').click(function(){add_abbreviation_to_option(the_id);});
						jQuery('#'+the_id+'-val').addClass('abbr-full');
					}
					else
					{	jQuery('#'+the_id+'-val').html("<strong>EN: </strong>"+data.fullname_en+"<br /><strong>CY:</strong> "+data.fullname_cy);
						jQuery('#'+the_id+'-val').addClass('abbr-full');
					}
				});	
			});
		}
		jQuery('#nice_options').append('<button id="add_option_abbr" >+</button>')
		jQuery('#add_option_abbr').click(function() 
		{	next = optioncount +1;
			jQuery('<input class="en" type="text" id="option-'+optioncount+'" value=""/>').insertBefore('#add_option_abbr');								
			jQuery('<span id="option-'+optioncount+'-val"/>').insertBefore('#add_option_abbr');
			jQuery('<span class="clearfix"/>').insertBefore('#add_option_abbr');
			optioncount=optioncount+1;
			init_update_options('en', 'abbr');
			return false;
		});
		init_update_options('en', 'abbr');
	}
}

function nicer_options_trans()
{	jQuery("#opts_en").addClass("hidden");
	jQuery("#opts_cy").addClass("hidden");
	jQuery("#nice_options").remove();
	current_settings=jQuery('#Questionbank_type').val();
	if(jQuery.inArray(current_settings, option_types)>=0)
	{	jQuery( "<div id='nice_options'><h3>Options</h3></div>" ).insertBefore( "#opts_en" );
		if(jQuery('#Questionbank_options_en').val()!="")
		{	options=jQuery('#Questionbank_options_en').val();
			options=options.split("*");
			options_cy=jQuery('#Questionbank_options_cy').val();
			options_cy=options_cy.split("*");
			optioncount=options.length;			
			jQuery.each(options, function( index, value ) 
			{	var plus_one=index+1;				
				var cy_opt="";
				jQuery('#nice_options').append('<span class="option_num">'+plus_one+')</span> <label for="option-en-'+index+'">EN:</label><input class="en" type="text" id="option-en-'+index+'" value="'+value+'"/>');				
				if(options_cy[index]!=undefined)
				{	cy_opt=options_cy[index];
				}
				jQuery('#nice_options').append('<label for="option-cy-'+plus_one+'">CY:</label><input class="cy" type="text" id="option-cy-'+index+'" value="'+cy_opt+'"/>');				
				jQuery('#nice_options').append('<span class="clearfix"/>');
			});			
		}
		jQuery('#nice_options').append('<button id="add_option_trans" >+</button>');
		jQuery('#add_option_trans').click(function() 
		{	next = optioncount +1;
			jQuery('<span class="option_num">'+next+')</span> <label for="option-en-'+optioncount+'">EN:</label><input class="en" type="text" id="option-en-'+optioncount+'" value=""/>').insertBefore('#add_option_trans');
			jQuery('<label for="option-cy-'+optioncount+'">CY:</label><input class="cy" type="text" id="option-cy-'+optioncount+'" value=""/>').insertBefore('#add_option_trans');
			jQuery('<span class="clearfix"/>').insertBefore('#add_option_trans');
			optioncount=optioncount+1;
			init_update_options('en',"trans");
			init_update_options('cy',"trans");
			return false;
		});
		init_update_options('en',"trans");
		init_update_options('cy',"trans");
		
	}
}
function init_update_options(lang, mode)
{	jQuery('#nice_options input.'+lang).each(function(){
			jQuery(this).on('keyup blur focusout',function(){
				if(mode=='abbr')
					{	the_val=jQuery(this).val();
						the_val=the_val.toLowerCase();
						the_id=jQuery(this).attr('id');
						jQuery.getJSON("/en/form-mananger/abbreviations/json?abbr="+the_val, function(){
							format: "json"
						}).done(function( data ) {
							if (jQuery.isEmptyObject(data))
							{	jQuery('#'+the_id+'-val').html('no matching abbreviation found - <a id="'+the_id+'-add">Add one</a>');								
								jQuery('#'+the_id+'-val').addClass('abbr-full');
								jQuery('#'+the_id+'-add').click(function(){add_abbreviation_to_option(the_id);});
							}
							else
							{	jQuery('#'+the_id+'-val').html("<strong>EN:</strong> "+data.fullname_en+"<br /><strong>CY:</strong> "+data.fullname_cy);
								jQuery('#'+the_id+'-val').addClass('abbr-full');
							}
						});		
					}
				vals=new Array;
				jQuery('#nice_options input.'+lang).each(function(){
					if(jQuery(this).val()!="")
					{	vals.push(jQuery(this).val());
					}
					
				});
				jQuery('#Questionbank_options_'+lang).val(vals.join('*'));
			});
				jQuery(this).on('keyup blur focusout',function(){					
					if(mode=='abbr')
					{	if(jQuery(this).val()=="")
						{	jQuery(this).closest('span .clearfix').remove();
							jQuery(this).remove();
							the_id=jQuery(this).attr('id');
							jQuery('#'+the_id+'-val').remove();
							jQuery('#'+the_id).remove();
						}
					}
					else
					{	the_id=jQuery(this).attr('id');
						alt_id="";
						if(the_id.indexOf('-en-')!=-1)
						{	alt_id=replaceAll('-en-', '-cy-', the_id);
						}
						else if(the_id.indexOf('-cy-')!=-1)
						{	alt_id=replaceAll('-cy-', '-en-', the_id);
						}
						if(jQuery('#'+the_id).val()=="" && jQuery('#'+alt_id).val()=="")
						{	jQuery('#'+the_id).prev('label').prev('span').remove();
							jQuery('#'+alt_id).prev('label').prev('span').remove();							
							jQuery('#'+the_id).prev('label').remove();
							jQuery('#'+alt_id).prev('label').remove();
							jQuery('#'+the_id).remove();
							jQuery('#'+alt_id).remove();	
							optioncount=optioncount-1;							
						}						
					}
				
				});
			
	
		});
}

function add_abbreviation_to_option(id)
{	jQuery('#'+id+'-val').html("");
	var url='../../abbreviations/createplain';
	//creating an iframe
	jQuery('#add_option_abbr').before('<iframe id="frameid" frameborder="0" height="235px" scrolling="no" width="100%"></iframe>'); 
	//caching jQuery object
	var iframe = jQuery('#frameid');	 
	//styling and setting url
	iframe.css({'border': 'none', 'overflow': 'hidden'});
	iframe.attr('src', url);	 
	//making sure iframe's content is ready
	iframe.load(function()
	{	jQuery('h1', jQuery('#frameid').contents()).remove();
		jQuery('#save_it', jQuery('#frameid').contents()).val("Add");
		jQuery('#abbreviations_abbr_name', jQuery('#frameid').contents()).val(jQuery('#'+id+'').val());
		jQuery('#abbr_name', jQuery('#frameid').contents()).attr('style','display:none;');
		jQuery('#abbreviations-form', jQuery('#frameid').contents()).bind({  
			submit: function()
			{  abbr_fade_reset();                
			} 
		});
		jQuery('#cancelbutton', jQuery('#frameid').contents()).attr("onclick", "parent.abbr_fade_reset();");

	});
}
function abbr_fade_reset()
{	jQuery('#frameid').fadeOut('slow', function(){
	   nicer_options_abbr();
	}); 
	
}

function gen_to_save()
{	var count=1;
	var savestring=""
	var my_options = jQuery("#formbuild" + ' option').each( function(){
		var class_type=jQuery(this).attr('class');
		class_type=class_type.split(" ");
		if(class_type[0].indexOf("-item")!=-1)
		{	class_type=class_type[0];
		}
		else
		{	class_type=class_type[1];
		}
		class_type=class_type.replace("-item", "");
		savestring=savestring+'{"id":"'+jQuery(this).attr('value') +'","type":"'+ class_type +'","position":"'+count+'"},';
		count=count+1;
	});	
	savestring = savestring.substring(0, savestring.length - 1);
	jQuery('#tosave').val(savestring);	
}

function load_from_db()
{	positions=array_from_db();
	jQuery.each(positions, function(key, value){
		if(value["type"]=="question")
		{	val=value['id'];
			jQuery('select[name="questionchooser"]').find('option[value="'+val+'"]').attr("selected",true);
			!jQuery('#questionchooser option:selected').remove().appendTo('#formbuild');
		}
		else
		{	val=value['id'];
			jQuery('select[name="elementchooser"]').find('option[value="'+val+'"]').attr("selected",true);
			!jQuery('#elementchooser option:selected').remove().appendTo('#formbuild');
		}
	});
	jQuery("#formbuild option").each(function(){
		jQuery(this).removeClass('hidden');
	});
}

function js_rule_build_generator()
{	jQuery.get("/formbuilder-assets/js/js_partials/route_build_row.mustache", function( data ) {
		jQuery('body').append(data);		
	}, "text" );
}

function js_rulepart_generator()
{	jQuery.get("/formbuilder-assets/js/js_partials/js_rulepart_generator.mustache", function( data ) {
		jQuery('body').append(data);		
	}, "text" );
}

function logicset_actionpart_generator()
{	prefix="";
	if(application=="ethics")
	{	prefix="ethics_";
	}
	jQuery.get("/formbuilder-assets/js/js_partials/"+prefix+"logicset_actionpart_generator.mustache", function( data ) {
		jQuery('body').append(data);		
	}, "text" );
}

function questionset_actionpart_generator()
{	jQuery.get("/formbuilder-assets/js/js_partials/questionset_actionpart_generator.mustache", function( data ) {
		jQuery('body').append(data);		
	}, "text" );
}

function js_rule_action_generator()
{	jQuery.get("/formbuilder-assets/js/js_partials/js_rule_action_generator.mustache", function( data ) {
		jQuery('body').append(data);		
	}, "text" );
}

function addRule(id, process)
{	var ruletext='{"if":[{"id":"'+id+'"},';
	var actiontext='';
	var isLogicset=process;
	var rule_text_area = 'rules';
	var finalrules_text_area = 'finalrules';
	if(isLogicset==true)
	{	ruletext=ruletext+'{"with":"'+jQuery("#qs_id").val()+'"},';
		rule_text_area = 'processing_rules';
		finalrules_text_area = 'finalprocessingrules';
	}
	ruletext=ruletext + getInputsAndVals("rulepart", id, "rule", isLogicset);	
	ruletext=ruletext+'*action*';
	if(isLogicset==true)
	{	actiontext = actiontext + getInputsAndVals("actionpart", id, "ls-action", isLogicset);
	}
	else
	{	actiontext = actiontext + getInputsAndVals("actionpart", id, "qs-action", isLogicset);
		actiontext = actiontext +']}';
	}	
	
	
	ruletext=ruletext+',';	
	ruletext=replaceAll(",,", ",", ruletext);
	rule=ruletext.replace("*action*", actiontext);
	if(isLogicset==true && rules_loaded==true)
	{	
		rule=','+rule;
	}	
	var current=jQuery("#"+rule_text_area).val();
	var currentcount= countInstances(current, "if");
	if((jQuery("#inverse-"+id).length >0) && (jQuery("#inverse-"+id).is(':checked')))
	{	var inverserule=replaceAll("hide", "sh-ow", rule);//intermediate step so we dont wipe it out if there was a mix of hides and sows to replace
		inverserule=replaceAll("show", "hi-de", inverserule); //as above
		inverserule=replaceAll("hi-de", "hide", inverserule);
		inverserule=replaceAll("sh-ow", "show", inverserule);
		var inverse_id=parseInt(id);
		inverse_id=inverse_id+1;
		inverserule=replaceAll('"id":"'+id+'"', '"id":"'+inverse_id+'"', inverserule);
		inverserule=replaceAll("!=", "jQuery=", inverserule);
		inverserule=replaceAll("==", "!=", inverserule);
		inverserule=replaceAll("jQuery=", "==", inverserule);
		inverserule=replaceAll(",,", ",", inverserule);
		//console.log(inverserule);
		/*
		inverserule=replaceAll("*=", "==", inverserule);
		inverserule=replaceAll("*=", "==", inverserule);*/
		
	//	var combined=current+''+rule+''+inverserule;
		if (typeof hadrulesonload !== 'undefined' && currentcount>0) {
			var combined=current+','+rule+''+inverserule
		}
		else
		{	var combined=current+''+rule+''+inverserule;
		}
		
		combined=replaceAll(",,", ",", combined);
		jQuery("#"+rule_text_area).val(combined);
	}
	else
	{	if (typeof hadrulesonload !== 'undefined' && currentcount>0) {
			var combined=current+','+rule;
		}
		else
		{	var combined=current+''+rule;
		}
		combined=replaceAll(",,", ",", combined);
		jQuery("#"+rule_text_area).val(combined);
	}	
	
	var final_rule=jQuery("#"+rule_text_area).val();
	final_rule = final_rule.trim();
	//console.log(final_rule);
	final_rule = final_rule.replace(/,\s*$/, "");
	final_rule = final_rule.replace(/^,/, ''); //remove a leading comma
	//console.log(final_rule);
	final_rule = '{"rules":['+ final_rule +']}';
	final_rule=encodeURIComponent(final_rule);
	
	jQuery("#"+finalrules_text_area).val(final_rule);
	jQuery("#add-rule-"+id).parent().addClass("green");
	jQuery("#add-rule-"+id).parent().find(":input").each( function(i) {
		jQuery(i).attr("readonly", "readonly")
	});
	jQuery("#add-rule-"+id).addClass("hidden");
	return false;
}

function getInputsAndVals(div, id, type, isLogicset)
{	var rules=[];
	var ruletext="";
	var items = jQuery("#"+div+"-"+id).find("input, select").map(function(index, elm) {
		rules.push({id: elm.id, value: jQuery(elm).val()});
		if(elm.type=="button" )
		{	rules.push("|");
		}		
	});	
	//console.log(items);
	var indexArray = jQuery.map(rules, function(elementOfArray, indexInArray) {
        return elementOfArray == "|" ? indexInArray : null;
	});	
	var count=0;
	jQuery.each(indexArray, function(key, value)
	{	if(count==0)
		{	if(type=="rule")
			{	ruletext=ruletext+''+rule_to_txt(parseInt(id), count, isLogicset);
			}
			if(type=="qs-action")
			{	ruletext=ruletext+''+qs_action_to_txt(parseInt(id), count);				
			}
			if(type=="ls-action")
			{	ruletext=ruletext+''+ls_action_to_txt(parseInt(id), count);				
			}
		}
		else
		{	var last;
			if(typeof indexArray[count] == 'undefined') 
			{	last=rules.length-1;				
			}
			else
			{	last=indexArray[count];				
			}
			if(type=="rule")
			{	ruletext=ruletext+''+rule_to_txt(parseInt(id), count, type);
			}
			if(type=="qs-action")
			{	ruletext=ruletext+''+qs_action_to_txt(parseInt(id), count);				
			}
			if(type=="ls-action")
			{	ruletext=ruletext+''+ls_action_to_txt(parseInt(id), count);				
			}
		}
		count=count+1;
	});
	if(type=="ls-action")
	{	ruletext=ruletext.replaceLast(',',']},');		
	}
	
	ruletext=replaceAll(",,", ",", ruletext);
	return ruletext;
}

function rule_to_txt(id1, id2, isLogicset)
{	var q_id=id1;
	var join="";
	var method='"observe":"change"';
	if(isLogicset==true)
	{	method='"check":"value"';
	}
	if(jQuery("#rule-element-select-"+id1+"-"+id2+" option:selected").is(".radiobuttons, .checkboxes"))
	{	var element='input[name=\''+jQuery("#rule-element-select-"+id1+"-"+id2).val()+'\'];checked';
	}
	else
	{	var element='#'+jQuery("#rule-element-select-"+id1+"-"+id2).val();
	}	
	if(jQuery("#rule-status-select-"+id1+"-"+id2).val()=="!=null" || jQuery("#rule-status-select-"+id1+"-"+id2).val()=="==null" )
	{	var status_value=jQuery("#rule-status-select-"+id1+"-"+id2).val()+''+jQuery("#action-element-select-values-"+id1+"-"+id2).val()+'';
	}
	else
	{	var status_value=jQuery("#rule-status-select-"+id1+"-"+id2).val()+'\''+jQuery("#action-element-select-values-"+id1+"-"+id2).val()+'\'';
	}
	if ((jQuery("#addCondition-"+id1+"-"+id2).val()=="AND") || (jQuery("#addCondition-"+id1+"-"+id2).val()=="OR"))
	{	join='{"join":"'+jQuery("#addCondition-"+id1+"-"+id2).val().toLowerCase()+'"},'
	}
	var rule='{"'+element+'":[{"value":"'+status_value+'",'+method+'}]},'+join;
	return rule;
}

function qs_action_to_txt(id1, id2)
{	var action=jQuery("#action-select-"+id1+"-"+id2).val();
	var action_on=jQuery("#action-element-select-"+id1+"-"+id2).val();
	var label_action = "";
	if(action == "hide" || action ==  "show")
	{	label_action =',{"action":{"'+action+'":"label[for=\''+action_on+'\']"}},{"action":{"'+action+'":"span[data-for=\''+action_on+'\']"}}';
	}
	var rule_action=',{"action":{"'+action+'":"#'+action_on+'"}}'+label_action+',';
	rule_action=replaceAll(",,", ",", rule_action);
	rule_action = rule_action.replace(/,+$/, "");
	return rule_action;	
}

function ls_action_to_txt(id1, id2)
{	var nonnulls={};
	var action="";
	var action_on="";
	var action_on_pt1="";
	var action_on_pt2="";
	jQuery('#actionpart-'+id1+'-'+id2).find("input, select").each(function() { 
		if(jQuery(this).val() != "") {
			var this_id=jQuery(this).attr('id');
			var this_val =jQuery(this).val();
			nonnulls[this_id]= this_val;			
		}   
	});
	jQuery.each(nonnulls, function(key, value){
		switch(key)
		{	case "action-select-"+id1+"-"+id2:
				action=value;
				break;
			case "action-queue-type-"+id1+"-"+id2:	
			case "email-recipiant-select-"+id1+"-"+id2:
			case "action-parts-select-"+id1+"-"+id2:
			case "fullquestionschooser-"+id1+"-"+id2:
				action_on_pt1=value;
				break;
			case "queuechooser-"+id1+"-"+id2:
			case "questionsetchooser-"+id1+"-"+id2:
			case "pageschooser-"+id1+"-"+id2:
			case "emailschooser-"+id1+"-"+id2:
			case "flagschooser-"+id1+"-"+id2:
			case "action-fullform-type-"+id1+"-"+id2:
				action_on_pt2=value;
				break;	
		}
	});
	if (action_on_pt1!="")
		{	action_on=action_on_pt1+'-'+action_on_pt2;
		}
		else
		{	action_on=action_on_pt2;
		}
	//var rule_action='{"action":{"'+action+'":"#'+action_on+'"}}]},';
	var rule_action='{"action":{"'+action+'":"#'+action_on+'"}},';
	rule_action = rule_action.replace(/,+jQuery/, "");
	return rule_action;		
}

function addQSActionCall(changed_element, id, condition_id)
{	var button_values=["+","AND","-"];
	var current=jQuery('#'+changed_element).val();
	var size=button_values.length;
	var current_index=button_values.indexOf(current);
	switch(current)
	{	case "+":
			var user_data, ruleaction;
			var default_option="<option value=''>Select</option>";
			var options=default_option;			
			jQuery('#formbuild option').each(function()
			{	if(jQuery(this).hasClass('question-item'))
				{	if(jQuery(this).attr('selected')=="selected")
					{	altered_this =  jQuery(this)[0].outerHTML.replace(/\bselected\b/g, "_")
						options = options + altered_this;
					}
					else
					{	options = options + jQuery(this)[0].outerHTML ;
					}
				}
			});		
			var statuses={"!=null":"Not Null", "==null":'Null', "==":'Equal to', "!=":'Not equal to',"isNumeric":"is a number"};
			var actions={"hide":"Hide", "show":'Show', "addup":"Add up", "subtract":"Subtract",  "toggle_req_on":"Make Required", "toggle_req_off":"Make Non-required"};
			var status_html=default_option;
			var actions_html=default_option;
			jQuery.each(statuses, function(key, value){
			  status_html=status_html+'<option value="'+key+'">'+value+'</option>';
			})
			jQuery.each(actions, function(key, value){
			  actions_html=actions_html+'<option value="'+key+'">'+value+'</option>';
			})
			var secondary_count = parseInt(condition_id)+1	;
			user_data = {
			id: id,
				condition_count:secondary_count,
				actions: actions_html,
				selected_elements: options,
			};
			html = ich.qs_actionpart(user_data);
			jQuery('#actionpart-'+id).append(html);		
			break;
		case "-":
			jQuery('#actionpart-'+id+'-'+(parseInt(condition_id)+1)).remove()
			break;		
	}
	var next = 0;
	if(current_index <(size -1))
	{	next=current_index+1;
	}	
	var next_value=button_values[next];
	var current=jQuery('#'+changed_element).val(next_value);	
	}

function addActionCall(changed_element, id, condition_id)
{	if(application=="form-manager")
	{	addActionCallFM(changed_element, id, condition_id);
	}
	if(application=="ethics")
	{	addActionCallER(changed_element, id, condition_id);
	}
}

function addActionCallFM(changed_element, id, condition_id)
{	var button_values=["+","AND","-"];
	var current=jQuery('#'+changed_element).val();
	var size=button_values.length;
	var current_index=button_values.indexOf(current);
	switch(current)
	{	case "+":
			var user_data, ruleaction;
			var default_option="<option value=''>Select</option>";
			var options=default_option;
			var actions_html=default_option;
			var parts_html=default_option;
			var email_recipiants_html=default_option;
			var queue_types_html=default_option;
			var fullformstatus_html=default_option;
			var actions={"redirect":"Redirect", "email":'Email', "queue":"Queue", "disablequestion":"Set Full Form Question"};
			jQuery.each(actions, function(key, value){
				actions_html=actions_html+'<option value="'+key+'">'+value+'</option>';
			})
			var parts={"questionset":"Questionset"};
			var emails={"participant":"Participant", "moderator":'Moderator'};

			var queues={"moderator":"Moderator", "specific":'Specific Queue'};
			jQuery.each(parts, function(key, value){
			  parts_html=parts_html+'<option value="'+key+'">'+value+'</option>';
			})
			jQuery.each(emails, function(key, value){
			  email_recipiants_html=email_recipiants_html+'<option value="'+key+'">'+value+'</option>';
			})	
			jQuery.each(queues, function(key, value){
			  queue_types_html=queue_types_html+'<option value="'+key+'">'+value+'</option>';
			})	

			var secondary_count = parseInt(condition_id)+1	;
			user_data = {
				id: id,
				condition_count:secondary_count,
				actions: actions_html,
				parts: parts_html,
				emails: email_recipiants_html,
				queues: queue_types_html,
			};
			html = ich.actionpart(user_data);
			jQuery('#actionpart-'+id).append(html); 
			var qsc=jQuery("#questionsetchooser").clone().prop({ id: "questionsetchooser-"+id+'-'+secondary_count, name: "questionsetchooser-"+rulecount+'-'+secondary_count});
			jQuery('#actionpart-'+id+'-'+secondary_count).append(qsc);
			var fqs=jQuery("#fullquestionschooser").clone().prop({ id: "fullquestionschooser-"+id+'-'+secondary_count, name: "fullquestionschooser-"+rulecount+'-'+secondary_count});
			jQuery('#action-select-'+id+'-'+secondary_count).after(fqs);
			jQuery('#fullquestionschooser-'+id+'-'+secondary_count).addClass("hidden");
			var psc=jQuery("#pageschooser").clone().prop({ id: "pageschooser-"+id+'-'+secondary_count, name: "pageschooser-"+rulecount+'-'+secondary_count});
			jQuery('#actionpart-'+id+'-'+secondary_count).append(psc);
			jQuery('#questionsetchooser-'+id+'-'+secondary_count).addClass("hidden");
			var flag=jQuery("#flagschooser").clone().prop({ id: "flagschooser-"+id+'-'+secondary_count, name: "flagschooser-"+rulecount+'-'+secondary_count});
			jQuery('#actionpart-'+id+'-'+secondary_count).append(flag);
			jQuery('#pageschooser-'+id+'-'+secondary_count).addClass("hidden");
			jQuery('#flagschooser-'+id+'-'+secondary_count).addClass("hidden");
			jQuery('#email-recipiant-select-'+id+'-'+secondary_count).addClass("hidden");
			jQuery('#action-queue-type-'+id+'-'+secondary_count).addClass("hidden");
			break;
		case "-":
			jQuery('#actionpart-'+id+'-'+(parseInt(condition_id)+1)).remove()
			break;		
	}
	var next = 0;
	if(current_index <(size -1))
	{	next=current_index+1;
	}	
	var next_value=button_values[next];
	var current=jQuery('#'+changed_element).val(next_value);	
}


function addActionCallER(changed_element, id, condition_id)
{	var button_values=["+","AND","-"];
	var current=jQuery('#'+changed_element).val();
	var size=button_values.length;
	var current_index=button_values.indexOf(current);
	switch(current)
	{	case "+":
			var user_data, ruleaction;
			var default_option="<option value=''>Select</option>";
			var options=default_option;
			var actions_html=default_option;
			var parts_html=default_option;
			var email_recipiants_html=default_option;
			var queue_types_html=default_option;
			var fullformstatus_html=default_option;
			var actions={"redirect":"Redirect", "email":'Email', "queue":"Queue", "flags":"Set Flag", "finish":"Finish"};
			jQuery.each(actions, function(key, value){
				actions_html=actions_html+'<option value="'+key+'">'+value+'</option>';
			})
			var parts={"questionset":"Questionset", "pages":'Page'};
			var emails={"participant":"Participant", "moderator":'Moderator', "administrator":'Administrator'};
			var fullformstatus={"locked":"Locked", "unlocked":'Unlocked'};
			var queues={"moderator":"Moderator", "specific":'Specific Queue'};
			jQuery.each(parts, function(key, value){
			  parts_html=parts_html+'<option value="'+key+'">'+value+'</option>';
			})
			jQuery.each(emails, function(key, value){
			  email_recipiants_html=email_recipiants_html+'<option value="'+key+'">'+value+'</option>';
			})	
			jQuery.each(queues, function(key, value){
			  queue_types_html=queue_types_html+'<option value="'+key+'">'+value+'</option>';
			})	
			jQuery.each(fullformstatus, function(key, value){
				fullformstatus_html=fullformstatus_html+'<option value="'+key+'">'+value+'</option>';
			})	
			var secondary_count = parseInt(condition_id)+1	;
			user_data = {
				id: id,
				condition_count:secondary_count,
				actions: actions_html,
				parts: parts_html,
				emails: email_recipiants_html,
				queues: queue_types_html
			};
			html = ich.actionpart(user_data);
			jQuery('#actionpart-'+id).append(html); 
			var qsc=jQuery("#questionsetchooser").clone().prop({ id: "questionsetchooser-"+id+'-'+secondary_count, name: "questionsetchooser-"+rulecount+'-'+secondary_count});
			jQuery('#actionpart-'+id+'-'+secondary_count).append(qsc);
			var fqs=jQuery("#fullquestionschooser").clone().prop({ id: "fullquestionschooser-"+id+'-'+secondary_count, name: "fullquestionschooser-"+rulecount+'-'+secondary_count});
			jQuery('#action-select-'+id+'-'+secondary_count).after(fqs);
			jQuery('#fullquestionschooser-'+id+'-'+secondary_count).addClass("hidden");
			var psc=jQuery("#pageschooser").clone().prop({ id: "pageschooser-"+id+'-'+secondary_count, name: "pageschooser-"+rulecount+'-'+secondary_count});
			jQuery('#actionpart-'+id+'-'+secondary_count).append(psc);
			jQuery('#questionsetchooser-'+id+'-'+secondary_count).addClass("hidden");
			var flag=jQuery("#flagschooser").clone().prop({ id: "flagschooser-"+id+'-'+secondary_count, name: "flagschooser-"+rulecount+'-'+secondary_count});
			jQuery('#actionpart-'+id+'-'+secondary_count).append(flag);
			jQuery('#pageschooser-'+id+'-'+secondary_count).addClass("hidden");
			jQuery('#flagschooser-'+id+'-'+secondary_count).addClass("hidden");
			jQuery('#email-recipiant-select-'+id+'-'+secondary_count).addClass("hidden");
			jQuery('#action-queue-type-'+id+'-'+secondary_count).addClass("hidden");
			break;
		case "-":
			jQuery('#actionpart-'+id+'-'+(parseInt(condition_id)+1)).remove()
			break;		
	}
	var next = 0;
	if(current_index <(size -1))
	{	next=current_index+1;
	}	
	var next_value=button_values[next];
	var current=jQuery('#'+changed_element).val(next_value);	
}

function addLogicsetConditionCall(changed_element, id, condition_id)
{	var button_values=["+", "AND", "OR", "-"];
	var current=jQuery('#'+changed_element).val();
	var size=button_values.length;
	var current_index=button_values.indexOf(current);
	switch(current)
	{	case "+":			
			var check_exists = changed_element.substring(0, changed_element.length - 1)+''+(parseInt(condition_id)+1);
			if(jQuery('#'+check_exists).length == 0)
			{	var default_option="<option value=''>Select</option>";
				var options=default_option;
				var user_data;
				jQuery('#formbuild option').each(function()
				{	if(jQuery(this).hasClass('question-item'))
					{	if(jQuery(this).attr('selected')=="selected")
						{	altered_this =  jQuery(this)[0].outerHTML.replace(/\bselected\b/g, "_")
							options = options + altered_this;
						}
						else
						{	options = options + jQuery(this)[0].outerHTML ;
						}
					}
				})
				var status_html=default_option;
				var statuses={"!=null":"Not Null", "==null":'Null', "==":'Equal to', "!=":'Not equal to',"isNumeric":"is a number"};
				jQuery.each(statuses, function(key, value){
				  status_html=status_html+'<option value="'+key+'">'+value+'</option>';
				})	
				user_data = {
					id: id,
					condition_count:(parseInt(condition_id)+1),
					selected_elements: options,
					status: status_html,
				};
				html = ich.rulepart(user_data);			
				jQuery('#rulepart-'+id).append(html); 
			}
			break;
		case "-":
			jQuery('#rulepart-'+id+'-'+(parseInt(condition_id)+1)).remove()
			break;			
	}
	var next = 0;
	if(current_index <(size -1))
	{	next=current_index+1;
	}	
	var next_value=button_values[next];
	var current=jQuery('#'+changed_element).val(next_value);	
}

function actions_select_change(changed_element, id, condition_id)
{	jQuery('#action-parts-select-'+id+'-'+condition_id).addClass('hidden');
	jQuery('#emailschooser-'+id+'-'+condition_id).addClass('hidden');
	jQuery('#email-recipiant-select-'+id+'-'+condition_id).addClass('hidden');
	jQuery('#questionsetchooser-'+id+'-'+condition_id).addClass('hidden');
	jQuery('#flagschooser-'+id+'-'+condition_id).addClass('hidden');	
	jQuery('#pageschooser-'+id+'-'+condition_id).addClass('hidden');
	jQuery('#queuechooser-'+id+'-'+condition_id).addClass('hidden');
	jQuery('#fullquestionschooser-'+id+'-'+condition_id).addClass('hidden');
	jQuery('#action-queue-type-'+id+'-'+condition_id).addClass('hidden');	
	jQuery('#action-fullform-type-'+id+'-'+condition_id).addClass('hidden');	
	jQuery('#action-parts-select-'+id+'-'+condition_id).val('');
	jQuery('#emailschooser-'+id+'-'+condition_id).val('');
	jQuery('#email-recipiant-select-'+id+'-'+condition_id).val('');
	jQuery('#questionsetchooser-'+id+'-'+condition_id).val('');
	jQuery('#pageschooser-'+id+'-'+condition_id).val('');
	jQuery('#queuechooser-'+id+'-'+condition_id).val('');
	jQuery('#action-queue-type-'+id+'-'+condition_id).val('');	
	switch (jQuery('#action-select-'+id+'-'+condition_id).val())
	{	case "email":
			var esc=jQuery("#emailschooser").clone().prop({ id: "emailschooser-"+id+'-'+condition_id, name: "emailschooser-"+id+'-'+condition_id});
			jQuery(esc).insertAfter('#action-select-'+id+'-'+condition_id);
			jQuery('#email-recipiant-select-'+id+'-'+condition_id).removeClass("hidden");
			break;
		case "queue":
			var esc=jQuery("#queuechooser").clone().prop({ id: "queuechooser-"+id+'-'+condition_id, name: "queuechooser-"+id+'-'+condition_id});
			jQuery(esc).insertAfter('#action-queue-type-'+id+'-'+condition_id);
			jQuery('#queuechooser-'+id+'-'+condition_id).addClass('hidden');
			jQuery('#action-queue-type-'+id+'-'+condition_id).removeClass("hidden");
			break;
		case "flags":
			jQuery('#flagschooser-'+id+'-'+condition_id).removeClass('hidden');
			break;
		case "redirect":
			jQuery('#action-parts-select-'+id+'-'+condition_id).removeClass('hidden');
			break;
		case "disablequestion":
			jQuery('#action-fullform-type-'+id+'-'+condition_id).removeClass('hidden');
			jQuery('#fullquestionschooser-'+id+'-'+condition_id).removeClass('hidden');
			break;
	}	
}

function actions_queue_type_change(changed_element, id, condition_id)
{	jQuery('#queuechooser-'+id+'-'+condition_id).addClass('hidden');
	if(jQuery('#'+changed_element).val()=="specific")
	{	jQuery('#queuechooser-'+id+'-'+condition_id).removeClass('hidden');
	}
}

function selected_rule_change(changed_element, id, condition_id)
{	var val= jQuery('#'+changed_element).find(":selected").attr('value');	
	if(val =="==" || val =="!=")
	{	jQuery('#placeholder-'+id+'-'+condition_id).removeClass("hidden");
	}
	else
	{	jQuery('#placeholder-'+id+'-'+condition_id).addClass("hidden");
	}
}

function selected_change(changed_element, id, condition_id)
{	var q_id= jQuery('#'+changed_element).find(":selected").attr('value');
	var default_option="<option value=''>Select</option>";
	var select_elem="<select id='action-element-select-values-"+id+"-"+condition_id+"'>";
	var gen_select="";
	jQuery("#rule-status-select-"+id+'-'+condition_id).val(0);
	if(jQuery('#'+changed_element).find(":selected").is('.select,.radiobuttons,.checkboxes'))
	{	//console.log(id + ' ' + q_id);	
		var options;
		var uri="/en/form-manager/questionbank/json?lang=en&encode=false&list=q"+q_id;
		jQuery.get( uri, function( response ) 
		{	response = response.trim();
			response = response.replace(/,+jQuery/, "");
			response = response.replace(/&(lt|gt|quot);/g, function (m, p) { 
				return (p == "lt")? "<" : (p == "gt") ? ">" : '"';
			});
		
			data = jQuery.parseJSON(response);			
			jQuery.each( data, function( key, val ) 
			{	if((""+key)=="options")
				{	options=val;
					gen_select=select_elem+default_option;
					jQuery.each( options, function( key, value ) 
					{	gen_select=gen_select+'<option value="'+value+'">'+value+'</option>';
					});
					gen_select=gen_select+'</option>';
					jQuery('#placeholder-'+id+'-'+condition_id).html(gen_select);
					jQuery('#placeholder-'+id+'-'+condition_id).addClass("hidden");
				}
			});
		});
	}
	else
	{	//console.log('not multiple choice');
		var text_equals="<input type=text' class='limit-text' id='action-element-select-values-"+id+"-"+condition_id+"'/>";
		jQuery('#placeholder-'+id+'-'+condition_id).html(text_equals);
		jQuery('#placeholder-'+id+'-'+condition_id).addClass("hidden");
	}
}

function js_rule_add()
{	
	var user_data, ruleaction;
	var default_option="<option value=''>Select</option>";
	var options=default_option;

		jQuery('#formbuild option').each(function()
		{	if(jQuery(this).hasClass('question-item'))
			{	if(jQuery(this).attr('selected')=="selected")
				{	altered_this =  jQuery(this)[0].outerHTML.replace(/\bselected\b/g, "_")
					options = options + altered_this;
				}
				else
				{	options = options + jQuery(this)[0].outerHTML ;
				}
			}
		});
		var status_html=default_option;
		var actions_html=default_option;
		var parts_html=default_option;
		var email_recipiants_html=default_option;
		var queue_types_html=default_option;
		var statuses={"!=null":"Not Null", "==null":'Null', "==":'Equal to', "!=":'Not equal to',"isNumeric":"is a number"};
		//console.log("1608"+system_name);
		var actions={"hide":"Hide", "show":'Show', "addup":"Add up", "subtract":"Subtract", "toggle_req_on":"Make Required", "toggle_req_off":"Make Non-required"};
		
		jQuery.each(statuses, function(key, value){
		  status_html=status_html+'<option value="'+key+'">'+value+'</option>';
		})
		jQuery.each(actions, function(key, value){
		  actions_html=actions_html+'<option value="'+key+'">'+value+'</option>';
		})
		var secondary_count=0;
		user_data = {
			id: rulecount,
			process: false,
			condition_count:secondary_count,
		};		
		html = ich.ruleaction(user_data);
		jQuery('#rule-definitions').append(html);
		user_data = {
			id: rulecount,
			condition_count:secondary_count,
			selected_elements: options,
			status: status_html,
		};
		html = ich.rulepart(user_data);
		jQuery('#rulepart-'+rulecount).append(html); 
		user_data = {
			id: rulecount,
			condition_count:secondary_count,
			actions: actions_html,
			selected_elements: options,
		};
		html = ich.qs_actionpart(user_data);
		jQuery('#actionpart-'+rulecount).append(html); 		
		rulecount=rulecount+1;
	
}
function actions_fullform_type_change(id)
{	//console.log(id);
}

function js_processing_rule_add()
{	//console.log("trying");
var user_data, ruleaction;
	var default_option="<option value=''>Select</option>";
	var options=default_option;
	jQuery('#formbuild option').each(function()
		{	if(jQuery(this).hasClass('question-item'))
			{	if(jQuery(this).attr('selected')=="selected")
				{	altered_this =  jQuery(this)[0].outerHTML.replace(/\bselected\b/g, "_")
					options = options + altered_this;
				}
				else
				{	options = options + jQuery(this)[0].outerHTML ;
				}
			}
		});
		var status_html=default_option;
		var actions_html=default_option;
		var parts_html=default_option;
		var email_recipiants_html=default_option;
		var queue_types_html=default_option;
		var fullformstatus_html=default_option;
		var statuses={"!=null":"Not Null", "==null":'Null', "==":'Equal to', "!=":'Not equal to',"isNumeric":"is a number"};
		var actions={"redirect":"Redirect", "finish":'Finish'};
		if(system_name=="RE")
		{	actions={"redirect":"Redirect to Questionset", "redirect-page":"Redirect to Page", "send-email":"Send Email", "set_flag":"Set Flag", "finish":'Finish'};
		}
		var parts={"questionset":"Questionset"};
		var emails={"participant":"Participant", "moderator":'Moderator'};
		var queues={"moderator":"Moderator", "specific":'Specific Queue'};
		var fullformstatus={"locked":"Locked", "unlocked":'Unlocked'};
		jQuery.each(statuses, function(key, value){
		  status_html=status_html+'<option value="'+key+'">'+value+'</option>';
		})
		jQuery.each(actions, function(key, value){
		  actions_html=actions_html+'<option value="'+key+'">'+value+'</option>';
		})
		jQuery.each(parts, function(key, value){
		  parts_html=parts_html+'<option value="'+key+'">'+value+'</option>';
		})
		jQuery.each(emails, function(key, value){
		  email_recipiants_html=email_recipiants_html+'<option value="'+key+'">'+value+'</option>';
		})	
		jQuery.each(queues, function(key, value){
		  queue_types_html=queue_types_html+'<option value="'+key+'">'+value+'</option>';
		})	
		jQuery.each(fullformstatus, function(key, value){
		  fullformstatus_html=fullformstatus_html+'<option value="'+key+'">'+value+'</option>';
		})	
		var secondary_count=0;
		user_data = {
			id: processingrulecount,
			process: true,
			condition_count:secondary_count,
		};		
		html = ich.ruleaction(user_data);
		jQuery('#processing-rule-definitions').append(html);
		user_data = {
			id: processingrulecount,
			condition_count:secondary_count,
			selected_elements: options,
			status: status_html,
		};
		html = ich.rulepart(user_data);
		jQuery('#rulepart-'+processingrulecount).append(html); 
		user_data = {
			id: processingrulecount,
			condition_count:secondary_count,
			actions: actions_html,
			parts: parts_html,
			emails: email_recipiants_html,
			queues: queue_types_html,
			fullform: fullformstatus_html,
		};
		html = ich.actionpart(user_data);
		jQuery('#actionpart-'+processingrulecount).append(html); 
		var qsc=jQuery("#questionsetchooser").clone().prop({ id: "questionsetchooser-"+processingrulecount+'-'+secondary_count, name: "questionsetchooser-"+processingrulecount+'-'+secondary_count});
		jQuery('#actionpart-'+processingrulecount+'-'+secondary_count).append(qsc);
		var fqs=jQuery("#fullquestionschooser").clone().prop({ id: "fullquestionschooser-"+processingrulecount+'-'+secondary_count, name: "fullquestionschooser-"+processingrulecount+'-'+secondary_count});
		jQuery('#action-select-'+processingrulecount+'-'+secondary_count).after(fqs);
		jQuery('#fullquestionschooser-'+processingrulecount+'-'+secondary_count).addClass("hidden");
		var psc=jQuery("#pageschooser").clone().prop({ id: "pageschooser-"+processingrulecount+'-'+secondary_count, name: "pageschooser-"+processingrulecount+'-'+secondary_count});
		jQuery('#actionpart-'+processingrulecount+'-'+secondary_count).append(psc);
		jQuery('#questionsetchooser-'+processingrulecount+'-'+secondary_count).addClass("hidden");
		var flag=jQuery("#flagschooser").clone().prop({ id: "flagschooser-"+processingrulecount+'-'+secondary_count, name: "flagschooser-"+processingrulecount+'-'+secondary_count});
		jQuery('#actionpart-'+processingrulecount+'-'+secondary_count).append(flag);
		jQuery('#pageschooser-'+processingrulecount+'-'+secondary_count).addClass("hidden");
		jQuery('#flagschooser-'+processingrulecount+'-'+secondary_count).addClass("hidden");
		jQuery('#email-recipiant-select-'+processingrulecount+'-'+secondary_count).addClass("hidden");
		jQuery('#action-queue-type-'+processingrulecount+'-'+secondary_count).addClass("hidden");
		processingrulecount=processingrulecount+1;
	
}

function removeRule(id)
{	//console.log(id);
	jQuery("#rule-"+id).remove();
	tmp_json=jQuery("#rules").val();
	tmp_json = tmp_json.replace(/,+$/, "");
	tmp_json='['+tmp_json+']';
	tmp_json=jQuery.parseJSON(tmp_json);
	var new_json=[];
	jQuery.each(tmp_json, function(key, value){
		if(value['if'][0]['id']!=id)
		{	new_json.push(JSON.stringify(value))
		}
	});
	var final_rule=new_json.toString()
	jQuery("#rules").val(final_rule);
	if(final_rule!="")
	{	final_rule = '{"rules":['+ final_rule +']}';
	}
	final_rule=encodeURIComponent(final_rule);
	jQuery("#finalrules").val(final_rule);
}

function removeProcessingRule(id)
{	//console.log(id);
	jQuery("#processing-rule-"+id).remove();
	tmp_json=jQuery("#processing_rules").val();
	tmp_json = tmp_json.replace(/,+$/, "");
	tmp_json='['+tmp_json+']';
	tmp_json=jQuery.parseJSON(tmp_json);
	var new_json=[];
	jQuery.each(tmp_json, function(key, value){
		if(value['if'][0]['id']!=id)
		{	new_json.push(JSON.stringify(value))
		}
	});
	var final_rule=new_json.toString()
	jQuery("#processing_rules").val(final_rule);
	if(final_rule!="")
	{	final_rule = '{"rules":['+ final_rule +']}';
	}
	final_rule=encodeURIComponent(final_rule);
	jQuery("#finalprocessingrules").val(final_rule);
}

function array_from_db()
{	var positions={};
	var data=jQuery('#tosave').val(); 
	//console.log(data);	
	data=jQuery.parseJSON('['+data+']');
	jQuery.each(data, function(key, value) {
		i=value['id']
		t=value['type']
		v=value['position']
		positions[""+v]={'id':""+i,'type':""+t};		
	});
	return positions;
}

function rules_from_db()
{	var load_rules=decodeURIComponent(jQuery('#finalrules').val());
	//console.log(load_rules);
	jQuery('#finalrules').val(load_rules);
	var rules =load_rules.replace('{"rules":[', '');
	rules = rules.substring(0, rules.length - 2);
	rules=replaceAll(']}{',']},{', rules);
	var last2 = rules.slice(-2);
	if(last2=="}]")
	{	rules=rules+'}'
	}
	jQuery('#rules').val(rules);
	if(rules.indexOf('}}]},')!=-1) 
	{	rules=replaceAll('}}]},','}}]},*', rules);

		var rules_arr=rules.split(',*');
		//console.log(rules_arr);
		jQuery.each(rules_arr, function(index, rule){
			var process_rules=jQuery.parseJSON('['+rule+']');
			//console.log(process_rules[0]['if'][0]['id']);
			if(typeof process_rules[0]!='undefined')
			{	var this_id=process_rules[0]['if'][0]['id'];
				var rule_li='<li id="rule-'+this_id+'" class="green">'+JSON.stringify(process_rules)+'<span class="deletecross"><a onClick="removeRule('+this_id+')">x</a><span></li>';
				jQuery('#rule-definitions').append(rule_li);			
			}
			rulecount=rulecount+1;
		});
	}
	else
	{	var process_rules=jQuery.parseJSON(rules);
		if( typeof process_rules['if']!='undefined')
		{	var this_id=process_rules['if'][0]['id'];
			var rule_li='<li id="rule-'+this_id+'" class="green">'+JSON.stringify(process_rules)+'<span class="deletecross"><a onClick="removeRule('+this_id+')">x</a><span></li>';
			jQuery('#rule-definitions').append(rule_li);
		}
		rulecount=rulecount+1;
	}	
	load_rules=jQuery('#rules').val();	
	var last1 = load_rules.slice(-1);
	if(last1==",")
	{	 load_rules=load_rules.substring(0, load_rules.length - 1);
	}	
	load_rules ='{"rules":['+ load_rules+ ']}';
	load_rules=encodeURIComponent(load_rules);
	jQuery('#finalrules').val(load_rules);
}



function processing_rules_from_db()
{	
	if(jQuery('#finalprocessingrules').val()!="")
	{	rules_loaded=true;
		var load_rules=decodeURIComponent(jQuery('#finalprocessingrules').val());
		//console.log(load_rules);
		jQuery('#finalprocessingrules').val(load_rules);
		var rules =load_rules.replace('{"rules":[', '');
		rules = rules.substring(0, rules.length - 2);
		rules=replaceAll(']}{',']},{', rules);
		var last2 = rules.slice(-2);
		if(last2=="}]")
		{	rules=rules+'}'
		}
		jQuery('#processing_rules').val(rules);
		if(rules.indexOf('}}]},')!=-1) 
		{	rules=replaceAll('}}]},','}}]},*', rules);
			var rules_arr=rules.split(',*');
			//console.log(rules_arr);
			jQuery.each(rules_arr, function(index, rule){
				var process_rules=jQuery.parseJSON('['+rule+']');
				//console.log(process_rules[0]['if'][0]['id']);
				if(typeof process_rules[0]!='undefined')
				{	var this_id=process_rules[0]['if'][0]['id'];
					var rule_li='<li id="processing-rule-'+this_id+'" class="green">'+JSON.stringify(process_rules)+'<span class="deletecross"><a onClick="removeProcessingRule('+this_id+')">x</a><span></li>';
					jQuery('#processing-rule-definitions').append(rule_li);			
				}
				processingrulecount=processingrulecount+1;
			});
		}
		else
		{	var process_rules=jQuery.parseJSON(rules);
			if( typeof process_rules['if']!='undefined')
			{	var this_id=process_rules['if'][0]['id'];
				var rule_li='<li id="processing-rule-'+this_id+'" class="green">'+JSON.stringify(process_rules)+'<span class="deletecross"><a onClick="removeProcessingRule('+this_id+')">x</a><span></li>';
				jQuery('#processing-rule-definitions').append(rule_li);
			}
			processingrulecount=processingrulecount+1;
		}	
		load_rules=jQuery('#processing_rules').val();	
		var last1 = load_rules.slice(-1);
		if(last1==",")
		{	 load_rules=load_rules.substring(0, load_rules.length - 1);
		}	
		load_rules ='{"rules":['+ load_rules+ ']}';
		load_rules=encodeURIComponent(load_rules);
		jQuery('#finalprocessingrules').val(load_rules);
	}

	
}

function action_parts_rule_change(element, id, condition_id)
{	jQuery("#questionsetchooser-"+id+'-'+condition_id).addClass("hidden");
	jQuery("#pageschooser-"+id+'-'+condition_id).addClass("hidden");
	jQuery("#questionsetchooser-"+id+'-'+condition_id).val("");
	jQuery("#pageschooser-"+id+'-'+condition_id).val("");
	switch(jQuery("#"+element).val())
	{	case "questionset":
			jQuery("#questionsetchooser-"+id+'-'+condition_id).removeClass("hidden");
			break;
		case "pages":
			jQuery("#pageschooser-"+id+'-'+condition_id).removeClass("hidden");
			break;		
	}
}

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function prepInverse(select, id)
{	if(jQuery('#'+select).val()=="hide" || jQuery('#'+select).val()=="show")
	{	var inverseCheck="<label for='inverse-"+id+"'><input name='inverse-"+id+"' id='inverse-"+id+"' type='checkbox'>add inverse?</label>";
		if(!jQuery("#inverse-"+id).length)
		{	jQuery('#actionpart-'+id).after(inverseCheck);
		}
	}
	else
	{	jQuery("#inverse-"+id).remove();
	}
}

function addcat(type)
{	jQuery('#catAddButton').addClass("hidden");
	var url='/en/form-manager/'+type+'categories/createplain';
	//creating an iframe
	jQuery('#qbc').before('<iframe id="frameid" frameborder="0" height="185px" scrolling="no" width="100%"></iframe>'); 
	//caching jQuery object
	var iframe = jQuery('#frameid');	 
	//styling and setting url
	iframe.css({'border': 'none', 'overflow': 'hidden'});
	iframe.attr('src', url);	 
	//making sure iframe's content is ready
	iframe.load(function()
	{	frame_callback(this, type);	 
	});             	
}

function frame_callback(frame){
   jQuery('h1', jQuery('#frameid').contents()).remove();
   jQuery('#save_it', jQuery('#frameid').contents()).val("Add");
   jQuery('#add_form', jQuery('#frameid').contents()).bind({  
         submit: function()
         {  fade_reset();                
         } 
   });
   jQuery('#cancelbutton', jQuery('#frameid').contents()).attr("onclick", "parent.fade_reset();");
}

function fade_reset()
{	jQuery('#frameid').fadeOut('slow', function(){
	   setTimeout("reset_iframe();", 80); 
	}); 
}

function refresh_cat()
{	jQuery('#qbc').fadeOut('slow', function(){});
	jQuery('#qbc').fadeIn('slow', function(){});	
}

function reset_iframe()
{	var cat_script="";
	var prefix="";
	if(window.location.href.indexOf("questionbank") > -1) {
		cat_script="questioncategories";
	}
	if(window.location.href.indexOf("element") > -1) {
		cat_script="elementcategories";
	}
	if(window.location.href.indexOf("/update/") > -1) {
		prefix="../";
	}
	var set_vals=[];	
	jQuery("input:checkbox[name='cat_group[]']:checked").each(function()
	{	set_vals.push(jQuery(this).val());
	});
	jQuery('#catAddButton').removeClass("hidden");
	jQuery('#frameid').remove();
	jQuery.ajax({
        url: prefix+"../"+cat_script+"/viewall",
        success: function(result) {
            html = jQuery(result);
			jQuery('#qbc').html(html);
			jQuery.each(set_vals, function(key, value)
			{	jQuery('#'+value).attr("checked", "checked");
			});
        },
    });   
}

function addorg()
{	jQuery('#catAddButton').addClass("hidden");
	var url='../organisation/createplain';
	//creating an iframe
	jQuery('#qbc').before('<iframe id="frameid" frameborder="0" height="185px" scrolling="no" width="100%"></iframe>'); 
	//caching jQuery object
	var iframe = jQuery('#frameid');	 
	//styling and setting url
	iframe.css({'border': 'none', 'overflow': 'hidden'});
	iframe.attr('src', url);	 
	//making sure iframe's content is ready
	iframe.load(function()
	{	frame_org_callback(this);	 
	});             	
}

function fade_org_reset()
{	jQuery('#frameid').fadeOut('slow', function(){
	   setTimeout("reset_org_iframe();", 80); 
	}); 
}

function refresh_org()
{	jQuery('#qbc').fadeOut('slow', function(){});
	jQuery('#qbc').fadeIn('slow', function(){});	
}

function frame_org_callback(frame){
   jQuery('h1', jQuery('#frameid').contents()).remove();
   jQuery('#save_it', jQuery('#frameid').contents()).val("Add");
   jQuery('#add_form', jQuery('#frameid').contents()).bind({  
         submit: function()
         {  fade_org_reset();                
         } 
   });
   jQuery('#cancelbutton', jQuery('#frameid').contents()).attr("onclick", "parent.fade_reset();");
}

function reset_org_iframe()
{	var set_vals=[];	
	jQuery("input:checkbox[name='cat_group[]']:checked").each(function()
	{	set_vals.push(jQuery(this).val());
	});
	jQuery('#catAddButton').removeClass("hidden");
	jQuery('#frameid').remove();
	jQuery.ajax({
        url: "../organisation/viewall",
        success: function(result) {
            html = jQuery(result);
			jQuery('#qbc').html(html);
			jQuery.each(set_vals, function(key, value)
			{	jQuery('#'+value).attr("checked", "checked");
			});
        },
    });   
}


function load_color_picker()
{	jQuery.getScript( "/formbuilder-assets/js/colorpicker.js" );
	jQuery.getScript( "/formbuilder-assets/js/eye.js" );
	jQuery.getScript( "/formbuilder-assets/js/utils.js" );
	//jQuery.getScript( "/formbuilder-assets/js/layout.js" );
	jQuery("<link/>", {
					   rel: "stylesheet",
					   type: "text/css",
					   href: "/formbuilder-assets/css/colorpicker.css"
					  }).appendTo("head");

}

function init_color_picker()
{	var input_id;
	var default_color ='#000000';
	jQuery('input.color-picker').each(function() {
		if(jQuery('#'+this.id).val()!="")
		{	default_color = jQuery('#'+this.id).val();
		}
		jQuery('#'+this.id).after('<div id="'+this.id+'-div" class="colpick colorhide"><div style="background-color: '+default_color+'"></div></div>');
	});
	
	jQuery('div.colpick').each(function(){
			var div_id=''+this.id;
			jQuery('#'+div_id).ColorPicker({
			color: default_color,
			onShow: function (colpkr) {
				jQuery(colpkr).fadeIn(500);
				return false;
			},
			onHide: function (colpkr) {
				jQuery(colpkr).fadeOut(500);
				return false;
			},
			onChange: function (hsb, hex, rgb) {
				jQuery('#'+div_id+' div').css('backgroundColor', '#' + hex);
				input_id=""+div_id;
				input_id=input_id.replace("-div", "");
				//console.log('#'+input_id);
				jQuery('#'+input_id).val('#' + hex);
			}
		});
	});
	if(jQuery('#Flags_type').val()!="display")
	{	/*jQuery('.colorhide').each(function()
		{	jQuery(this).addClass('hidden');
		});*/
	}
}


function make_tabs()
{	jQuery(".tabs-menu a").click(function(event) {
        event.preventDefault();
        jQuery(this).parent().addClass("current");
        jQuery(this).parent().siblings().removeClass("current");
        var tab = jQuery(this).attr("href");
        jQuery(".tab-content").not(tab).css("display", "none");
        jQuery(tab).fadeIn();
    });
}

function make_tabs2()
{	jQuery(".tabs-menu-2 .current-2 a").each(function(){
		var tab = jQuery(this).attr("href");
        jQuery(".tab-content-2").not(tab).css("display", "none");
        jQuery(tab).fadeIn();
	});
	jQuery(".tabs-menu-2 a").click(function(event) {
        event.preventDefault();
        jQuery(this).parent().addClass("current-2");
        jQuery(this).parent().siblings().removeClass("current-2");
        var tab = jQuery(this).attr("href");
        jQuery(".tab-content-2").not(tab).css("display", "none");
        jQuery(tab).fadeIn();
    });
    
}

function get_checked_categories(type)
{	var cats=[];
	jQuery("#"+type+"-categories input[type=checkbox]:checked" ).each(function(){
		cats.push(jQuery(this).val());
	});
	return cats;
}

function question_filter(show_cats, elem)
{	jQuery(elem).each(function(){
		jQuery(this).addClass('hidden');
	});
	jQuery(elem).each(function(){
		var compare=this;
		jQuery.each(show_cats, function( index, value ) {
			if(jQuery(compare).hasClass(value))
			{	jQuery(compare).removeClass('hidden');
			}
		});
	});
}

function store_to_cookie(name, show_cats)
{	var store = show_cats.join(';');
	 jQuery.cookie(name, store, {expires: 7}); // Save cookie	
}

function set_from_cookie(name, type)
{	if(jQuery.cookie(name))
	{	var cats=jQuery.cookie(name).split(';');
		jQuery("#"+type+"-categories input[type=checkbox]" ).each(function(){
			jQuery(this).removeAttr('checked');
		});	
		jQuery("#"+type+"-categories input[type=checkbox]" ).each(function(){
			if(cats.indexOf(jQuery(this).val())!=-1)
			{	jQuery(this).attr('checked','checked');	
			}
		});	
	}
	else
	{	
		if(window.is_admin===true)
		{	
			jQuery("#"+type+"-categories input[type=checkbox]" ).each(function(){
				var attr = jQuery(this).attr('data-owner');
				if (typeof attr !== typeof undefined && attr !== false) {
					jQuery(this).removeAttr('checked');
				}
				if(jQuery(this).attr("data-owner")=="admin" || jQuery(this).attr("data-owner")==window.current_user)
				{	jQuery(this).attr('checked','checked');
				}

			});
		}
		else
		{	jQuery("#"+type+"-categories input[type=checkbox]" ).each(function(){
				jQuery(this).attr('checked','checked');
			});
		}
	}
}

function build_validation_rule()
{	var text_types=["text", "textarea", "password"];
	if(text_types.indexOf(jQuery('#Questionbank_type').val())!=-1)
	{	var just_required=',"validate" : { "required" : true, "messages" : {"required" : "Required input"}}';	
	}
	else
	{	var just_required=',"required" : "required" ';
	}
	
	var validation_layout=',"validate" : {"required" : true, "rule" : value, "messages" : { "required" : "Required input", "rule" : "reason"}}';
	var rule_en=rule_cy="";
	rule_en=replaceAll("rule",jQuery('#setvalidtype').val(),  validation_layout );
	switch(jQuery('#setvalidtype').val())
	{	case "minlength":
			rule_en=replaceAll("value",jQuery('#min-size').val(),  rule_en );
			rule_cy=replaceAll("reason","Rhaid bod y fwy na "+jQuery('#min-size').val()+" nod",  rule_en );
			rule_en=replaceAll("reason","Field must be more than "+jQuery('#min-size').val()+" characters",  rule_en );
			break;
		case "maxlength":
			rule_en=replaceAll("value",jQuery('#max-size').val(),  rule_en );
			rule_cy=replaceAll("reason","Rhaid bod y llai na "+jQuery('#max-size').val()+" nod",  rule_en );
			rule_en=replaceAll("reason","Field must be less than "+jQuery('#max-size').val()+" characters",  rule_en );
			break;	
		case "rangelength":
			rule_en=replaceAll("value","["+jQuery('#min-size').val()+","+jQuery('#max-size').val()+"]",  rule_en );
			rule_cy=replaceAll("reason","Rhaid fod rhwng "+jQuery('#min-size').val()+" a "+jQuery('#max-size').val()+" nod",  rule_en );
			rule_en=replaceAll("reason","Field must be between "+jQuery('#min-size').val()+" and "+jQuery('#max-size').val()+" characters",  rule_en );
			break;	
		case "number":
			rule_en=replaceAll("value", "true",  rule_en );
			rule_cy=replaceAll("reason","Rhaid bod yn rif",  rule_en );
			rule_en=replaceAll("reason","Must be a number",  rule_en );
			break;	
		case "email":
			rule_en=replaceAll("value", "true",  rule_en );
			rule_cy=replaceAll("reason","Rhaid bod yn gyfeiriad ebost cywir",  rule_en );
			rule_en=replaceAll("reason","Must be a valid email address",  rule_en );
			break;	
		case "ucas":
			rule_en=replaceAll("value", "true",  rule_en );
			rule_cy=replaceAll("reason","Rhowch eich rhif 10-digid UCAS",  rule_en );
			rule_en=replaceAll("reason","Please enter your 10 digit UCAS code",  rule_en );
			break;	
		case "telephone":
			rule_en=replaceAll("value", "true",  rule_en );
			rule_cy=replaceAll("reason","Rhowch eich Rhif Ffôn",  rule_en );
			rule_en=replaceAll("reason","Please enter your Telephone Number",  rule_en );
			break;	
		case "date":
			rule_en=replaceAll("value", "true",  rule_en );
			rule_cy=replaceAll("reason","Rhaid bod yn ddyddiad cywir",  rule_en );
			rule_en=replaceAll("reason","Must be a valid date",  rule_en );
			break;	
		case "dateUK":
			rule_en=replaceAll("value", "true",  rule_en );
			rule_cy=replaceAll("reason","Rhowch Dyddiad ddilys - mae\'n rhaid iddo fod yn fformat y DU (dd/mm/bbbb) ",  rule_en );
			rule_en=replaceAll("reason","Please enter a valid Date - must be in UK (dd/mm/yyyy) format",  rule_en );
			break;	
		case "":
			rule_en=rule_cy=just_required;
			break
	}
	rule_cy=replaceAll("Required input", "Mae\'r maes hwn yn orfodedig", rule_cy);
	jQuery('#Questionbank_validation_en').val(rule_en);
	jQuery('#Questionbank_validation_cy').val(rule_cy);
	
}
function questionset_element_details(elem, is_question, is_locked)
{	clear_design_question_setting();
	if(is_locked==false)
	{	jQuery('#form-area').append("<div id='setting-"+elem+"' class='question_setting'><h4>Setting for element "+elem+"</h4><a onclick='edit_it(\"element\", "+elem+")'>Edit Element "+elem+"</a></div>");
	}
}

function questionset_field_details(elem, is_question, is_locked, is_always_required)
{	clear_design_question_setting();
	if(is_question==true)
	{	var checked="";
		if(jQuery.inArray(elem, unrequired)==-1)
		{	var checked="checked='checked'";
		}
		var postfix="";
	//console.log(is_locked);
		if(is_locked==false)
		{	postfix="<a onclick='edit_it(\"questionbank\", "+elem+")'>Edit Question "+elem+"</a>";
		}
		if(is_always_required===false)
		{	jQuery('#form-area').append("<div id='setting-"+elem+"' class='question_setting'><h4>Setting for question "+elem+"</h4><label for='required-"+elem+"'>Required</label><input type='checkbox' name='required-"+elem+"' id='required-"+elem+"' "+checked+"/>"+postfix+"</div>");
		}
		else
		{	jQuery('#form-area').append("<div id='setting-"+elem+"' class='question_setting'><h4>Setting for question "+elem+"</h4>"+postfix+"</div>");
		}
		jQuery('#required-'+elem).change(function(){
			if(jQuery(this).is(':checked')==true)
			{	var i = jQuery.inArray(elem,unrequired);
				if (i >= 0)
				{	unrequired.splice(i, 1);
				}				
			}
			else
			{	if(jQuery.inArray(elem, unrequired)==-1)
				{	unrequired.push(elem);
				}
			}
			unrequired = unrequired.filter(function(n){ return n != undefined });
			var set_nonrequired=unrequired.join(",");
			if (set_nonrequired.substring(0, 1) == ',') { 
			  set_nonrequired = set_nonrequired.substring(1);
			}			
			jQuery('#nonrequired').val(set_nonrequired);
		});
		
	}
	
}

function clear_design_question_setting()
{	jQuery('#form-area .question_setting').each(function()
	{	jQuery(this).remove();
	});
}

function get_entity_fullname()
{	jQuery('#abbreviations_fullname_en').keyup(function () {populate_abbr('#abbreviations_fullname_en');});
	jQuery('#abbreviations_fullname_cy').keyup(function () {populate_abbr('#abbreviations_fullname_cy');});
	var abbr= jQuery('#entity_abbr_name').val();
	jQuery('#entity_abbr_name').val(abbr.toLowerCase())
	var longnames;
	if (abbr!= "")
	{	jQuery.getJSON("../../abbreviations/json?abbr="+abbr.toLowerCase(), function(){
		    format: "json"
		}).done(function( data ) {
			if (jQuery('#fullinfo').length == 0) 
			{	jQuery('<div id="fullinfo"></div>').insertAfter('#entity_abbr_name');
			
			}
			if (jQuery.isEmptyObject(data))
			{	jQuery('#fullinfo').html("<br /><p><strong>No fullname information found -</strong> Please complete below</p>");
				jQuery('#abbreviations').removeClass('hidden');
				jQuery('#abbr_name').addClass('hidden');								
			}
			else
			{	jQuery('#abbreviations').addClass('hidden');				
				jQuery('#abbreviations_fullname_en').val("");
				jQuery('#abbreviations_fullname_cy').val("");
				jQuery('#abbreviations_abbr_name').val("");
				jQuery('#fullinfo').html("<br />Fullname(EN): "+data.fullname_en+"<br /> Fullname(CY): "+data.fullname_cy)
			}
		});
	}	
}

function populate_abbr(elem)
{	var welsh=false;
	if(elem!="#abbreviations_fullname_en")
	{	welsh=true;
	}
	if(jQuery(elem).val()!="")
	{	jQuery('#abbreviations_abbr_name').val(jQuery('#entity_abbr_name').val());
	}
	else
	{	if(welsh==true)
		{	if(jQuery(elem).val()=="" && jQuery("#abbreviations_fullname_en").val()=="")
			{	jQuery('#abbreviations_abbr_name').val("");
			}
		}
		else
		{	jQuery('#abbreviations_abbr_name').val("");
		}		
	}
}

function init_entity_hover()
{	jQuery('.entity-hoverable').each(function() {
    //alert( this.id );
    jQuery( "#"+this.id ).mouseover(function() {
		var the_id=this.id;
		if(jQuery( "#"+this.id ).attr('title')===undefined)
		{
		jQuery('#'+this.id).attr("title","requesting");
		}
		if(jQuery( "#"+this.id ).attr('title')=="requesting")
		{	jQuery.getJSON("/en/form-manager/abbreviations/json?abbr="+this.id, function(){
				format: "json"
			}).done(function( data ) {
				if (jQuery.isEmptyObject(data))
				{	jQuery('#'+the_id).attr("title","fullname not found");								
				}
				else
				{
					jQuery('#'+the_id).attr("title","EN: "+data.fullname_en+", CY: "+data.fullname_cy);
				}
			});		
		}
		});
	});
}


function moderation_tools()
{	jQuery(".btn").click(function(){
		p_id = jQuery(this).closest('.mod-toolbar').attr('id').replace(/[^0-9\.]/g, '');
		p_pos = jQuery(this).closest('.mod-toolbar').attr('id').replace(/[^a-zA-Z\(\)]/g, '');
		jQuery('#'+p_pos+'-action-'+p_id).val("approve");   
		if(jQuery(this).hasClass('approve'))
		{	jQuery('#'+p_pos+'-action-'+p_id).val("approve");   
		}
		else
		{	jQuery('#'+p_pos+'-action-'+p_id).val("refer");   
		}
		jQuery('#'+p_pos+'-form-'+p_id).removeClass("hidden");
		jQuery('#'+p_pos+'-submit-'+p_id).addClass("hidden");
		//console.log(p_pos);
	});

	jQuery(".btn").mouseenter(function(){
		jQuery(this).css({"font-weight":"bold"});
	});
	jQuery(".btn").mouseleave(function(){
		jQuery(this).css({"font-weight":"normal"});
	});
	jQuery(".modmessage").keyup(function(){
		p_id = jQuery(this).closest('.mod-toolbar').attr('id').replace(/[^0-9\.]/g, '');
		p_pos = jQuery(this).closest('.mod-toolbar').attr('id').replace(/[^a-zA-Z\(\)]/g, '');
		len=jQuery(this).val().length;
		if(len>5)
		{	jQuery('#'+p_pos+'-submit-'+p_id).removeClass("hidden");
		}
		if(len<=5)
		{	jQuery('#'+p_pos+'-submit-'+p_id).addClass("hidden");
		}
	});
}

function admin_accept_reject()
{	if (jQuery('.multiaction').length)	
	{	jQuery('.multiaction').each(function(){
			jQuery(this).removeClass('hidden');
		});
	}
	var selected_for_batch = new Array();
	jQuery('#selectall').change(function()
	{	if (jQuery(this).is(':checked'))
		{	jQuery('.selectforbatch').each(function(){
				jQuery(this).attr("checked", "checked");	
				selected_for_batch.push(jQuery(this).attr('id'));											
				
			});
		} 
		else
		{	jQuery('.selectforbatch').each(function(){
				jQuery(this).removeAttr("checked");	
				selected_for_batch=[];				
			});
		}
		selected_for_batch = selected_for_batch.filter(function(elem, pos) 
		{	return selected_for_batch.indexOf(elem) == pos;
		})
		//console.log(selected_for_batch.join(","));
		jQuery('#checkedlist').val(selected_for_batch.join(","));
	});
	jQuery('.selectforbatch').change(function()
		{	if (jQuery(this).is(':checked'))
			{	if(selected_for_batch.indexOf!=-1)
				{	selected_for_batch.push(jQuery(this).attr('id'));
				}
			}
			else
			{	if(selected_for_batch.indexOf!=-1)
				{	var elem =jQuery(this).attr('id');
					var i = jQuery.inArray(elem,selected_for_batch);
					if (i >= 0)
					{	selected_for_batch.splice(i, 1);
					}
				}
			}
			selected_for_batch = selected_for_batch.filter(function(elem, pos) 
			{	return selected_for_batch.indexOf(elem) == pos;
			})
			jQuery('#checkedlist').val(selected_for_batch.join(","));
		});
}
function confirmDelete(id)
{	 if (!confirm("CAUTION\n\r\n\rPlease note that should you proceed, the data collected by this form will also be purged. If you need the data for future use, ensure that you have downloaded a copy of the CSV file before proceeding.\n\nOnce the form is deleted you'll also need to remove it from the CMS unless you have already done so.\r\n\r\nDo you wish to proceed? ")){
      //return false;
    }
    else
    {	url = document.URL;
		url	= url.replace("listing/", ""); 
		url = url +"del/?id="+id;
		//console.log(url);
		window.location = url;
	}
}
function confirmPurge(id)
{	 if (!confirm("CAUTION\n\r\n\rPlease note that should you proceed, the data collected by this form will purged. If you need the data for future use, ensure that you have downloaded a copy of the CSV file before proceeding.\n\r\n\r\nDo you wish to proceed? ")){
      //return false;
    }
    else
    {	url = document.URL;
		url	= url.replace("listing/", ""); 
		url = url +"purge/?id="+id;
		window.location = url;
	}
}

function remove_duplicate_headers()
{	//console.log("executing header removal");
	jQuery('.ui-dform-h3').each(function(){
		if(jQuery(this).next().is('h3'))
		{	jQuery(this).remove();
		}
	});
	jQuery('.ui-dform-h4').each(function(){
		if(jQuery(this).next().is('h4'))
		{	jQuery(this).remove();
		}
	});
}

function add_view_toolbar_links()
{	jQuery('#view-toolbar').append('<a class="faux-tab active" id="design-tab" onclick="show_design_view()">Design</a><a  id="settings-tab" class="faux-tab" onclick="show_settings_view()">Settings</a>');
	if(jQuery("#history").length)
	{	jQuery('#view-toolbar').append('<a  id="history-tab" class="faux-tab" onclick="show_history_view()">History</a>');
	}
	jQuery('#view-toolbar').append('<a class="ui-button" onclick="do_save()">Save</a>');
}

function add_toolbar_links()
{	jQuery('#top-toolbar').append('<a onclick="question_frame()"><span class="toolbar-label">New Question</span><img src="/formbuilder-assets/img/new_question_icon3.png" class="float-left no-border" style="margin:0; margin-right:0.3em;"/></a><a onclick="element_frame()"><span class="toolbar-label">New Element</span><img src="/formbuilder-assets/img/new_element_icon3.png" class="float-left no-border" style="margin:0; margin-right:0.3em;"/></a><a onclick="preview_frame(\'en\')"><img src="/formbuilder-assets/img/preview-icon-en2.png" class="float-left no-border" style="margin:0; margin-right:0.3em;"/><span class="toolbar-label">English Preview</span></a><a onclick="preview_frame(\'cy\')"><img src="/formbuilder-assets/img/preview-icon-cy2.png" class="float-left no-border" style="margin:0; margin-right:0.3em;"/><span class="toolbar-label">Welsh Preview</span></a>');
	jQuery.ajax({
			url : "/js/libs/jquery.fancybox.js",
			dataType : 'script',
			success : function(data) {
				include_css("/css/jquery_ui/jquery.fancybox.css");
						jQuery('.fancybox-container a').fancybox();
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				//alert("panic");
			}
		});
}

/*function add_toolbar_links()
{	jQuery('#nav_local li').last().prev().append('<ul class="multilevel-linkul-0"><li><a onclick="question_frame()">New Question<img src="/formbuilder-assets/img/new_question_icon.png" class="float-left no-border" style="margin:0; margin-right:0.3em;"/></a></li><li><a onclick="element_frame()">New Element<img src="/formbuilder-assets/img/new_element_icon.png" class="float-left no-border" style="margin:0; margin-right:0.3em;"/></a></li><li><a onclick="preview_frame(\'en\')"><img src="/formbuilder-assets/img/preview-icon-en.png" class="float-left no-border" style="margin:0; margin-right:0.3em;"/>Preview (EN)</a></li><li><a onclick="preview_frame(\'cy\')"><img src="/formbuilder-assets/img/preview-icon-cy.png" class="float-left no-border" style="margin:0; margin-right:0.3em;"/>Preview (CY)</a></li></ul>');
	jQuery.ajax({
			url : "/js/libs/jquery.fancybox.js",
			dataType : 'script',
			success : function(data) {
				include_css("/css/jquery_ui/jquery.fancybox.css");
						jQuery('.fancybox-container a').fancybox();
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				//alert("panic");
			}
		});
}*/

function question_frame()
{	jQuery.fancybox({
    padding : 0,
    href:'../../questionbank/create?frame=clear',
    type: 'iframe',
    width: '65%',
	afterLoad : function(){
		jQuery(".fancybox-iframe").each(function(){
			frame_id=jQuery(this).attr("id");
			bind_to_submit(frame_id, 'questionbank');
		});
	},
    afterClose : function(){
             frame_closed('questionchooser');
           }
	});
}

function element_frame()
{	jQuery.fancybox({
    padding : 0,
    href:'../../element/create?frame=clear',
    type: 'iframe',
    width: '60%',
    maxHeight:'550px',
	afterLoad : function(){
		jQuery(".fancybox-iframe").each(function(){
			frame_id=jQuery(this).attr("id");
			bind_to_submit(frame_id, 'element');
		});
	},
    afterClose : function(){
             frame_closed('elementchooser');
           }
	});	
}

function preview_frame(lang)
{	var json=jQuery('#tosave').val();
	var append="";
	submit_label_en=""+jQuery("#submit_label_en").val();
	submit_label_cy=""+jQuery("#submit_label_cy").val();
	if(submit_label_en.trim()!=="")
	{	append="&label_en="+submit_label_en.trim();
	}
	if(submit_label_cy.trim()!=="")
	{	append=append+"&label_cy="+submit_label_cy.trim();
	}
	jQuery.fancybox({
    padding : 0,
    href:'/'+lang+'/form-manager/questionset/liveview?json='+json+append,
    type: 'iframe',
    width: '80%',
    afterClose : function(){
             frame_closed('questionchooser');
           }
	});
}

function edit_it(type, id)
{	jQuery.fancybox({
    padding : 0,
    href:'../../'+type+'/update/?id='+id+'&frame=clear',
    type: 'iframe',
    width: '80%',
	afterLoad : function(){
		jQuery(".fancybox-iframe").each(function(){
			frame_id=jQuery(this).attr("id");
			bind_to_update_submit(frame_id, type, id);
		});
	},
    afterClose : function(){
             frame_closed('questionchooser');
           }
	});
}



function frame_closed(type)
{	//console.log("now need to update "+type);
}

function bind_to_submit(frame_id, type)
{	//console.log(frame_id +' , '+ type);
	jQuery('#'+type+'-add-form', jQuery('#'+frame_id).contents()).bind({  
		submit: function()
		{ 	jQuery.fancybox.close();
			setTimeout(function(){append_new_entry(type)}, 1000);        
		} 		
	});
}

function bind_to_update_submit(frame_id, type, id)
{	//console.log(frame_id +' , '+ type);
	jQuery('#'+type+'-form', jQuery('#'+frame_id).contents()).bind({  
		submit: function()
		{ 	jQuery.fancybox.close();
			setTimeout(function(){update_entry(type, id)}, 1000);        
		} 		
	});
}

function append_new_entry(type)
{	//console.log("Run append new entry for " + type);
	jQuery.getJSON("/en/form-manager/"+type+"/json?list=last", function(){
				format: "json"
			}).done(function( data ) {
				if (jQuery.isEmptyObject(data))
				{	console.log("no data");								
				}
				else
				{	if(type=="questionbank")
					{	jQuery("#questionchooser").append("<option class='question-item "+data.type+" "+data.categories+"' title='"+data.id+")' "+data.caption+" value="+data.id+" data-status='"+data.status+"'>"+data.caption+"</option>");
						jQuery('#questionchooser option[value="'+data.id+'"]').remove().appendTo('#formbuild');  
					}
					if(type=="element")
					{	jQuery("#elementchooser").append("<option class='element-item "+data.categories+"' value='"+data.id.replace(/\D/g,'')+"' data-status='"+data.status+"'>"+data.type + " - " +data.html+"</option>");						
						jQuery('#elementchooser option[value="'+data.id.replace(/\D/g,'')+'"]').remove().appendTo('#formbuild');  
					}			
				}
			}).error(function() { alert("error"); });	
}

function update_entry(type, id)
{	//console.log("need to update "+id +" type: "+type);
	var short_type=type.replace("bank", "");
	if(short_type=="question")
	{	short_type="questions";
	}
	jQuery.getJSON("/en/form-manager/"+type+"/json?list={\""+short_type+"\":[\""+id+"\"]}", function(){
				format: "json"
			}).done(function( data ) {
				if (jQuery.isEmptyObject(data))
				{	console.log("no data");								
				}
				else
				{	if(type=="questionbank")
					{	jQuery("#formbuild option").each(function(){
							//console.log(this);
							if(jQuery(this).attr("value")==id && jQuery(this).hasClass("question-item"))
							{ jQuery(this).replaceWith("<option class='question-item "+data.type+" "+data.categories+"' title='"+data.id+")' "+data.caption+" value="+data.id+" data-status='"+data.status+"'>"+data.caption+"</option>");
							}
						});
						
					}
					if(type=="element")
					{	jQuery("#formbuild option").each(function(){
							//console.log(this);
							if(jQuery(this).attr("value")==id && jQuery(this).hasClass("element-item"))
							{ jQuery(this).replaceWith("<option class='element-item "+data.categories+"' value="+data.name+" data-status='"+data.status+"'>"+data.type+" - "+data.html+"</option>");
							}
						});
						
					}
					/*if(type=="element")
					{	jQuery("#elementchooser").append("<option class='element-item "+data.categories+"' value='"+data.id.replace(/\D/g,'')+"'>"+data.type + " - " +data.html+"</option>");						
					}*/			
				}
			}).error(function() { alert("error"); });	
}

function init_wym()
{		if( (typeof isAdmin != 'undefined' ) && isAdmin===true){ //give admins the HTML button
			tools.push({'name': 'ToggleHtml', 'title': 'HTML', 'css': 'wym_tools_html'});
		}

		var wymConfig = {
			wymPath : '/js/libs/wymeditor/jquery.wymeditor.js',
			toolsItems: [
							{'name': 'Bold', 'title': 'Strong', 'css': 'wym_tools_strong'},
							{'name': 'Italic', 'title': 'Emphasis', 'css': 'wym_tools_emphasis'},
							{'name': 'CreateLink', 'title': 'Link', 'css': 'wym_tools_link'},
							{'name': 'Unlink', 'title': 'Unlink', 'css': 'wym_tools_unlink'},
							{'name': 'Paste', 'title': 'Paste_From_Word', 'css': 'wym_tools_paste'},
							{'name': 'ToggleHtml', 'title': 'HTML', 'css': 'wym_tools_html'}
						],
			basePath : '/js/libs/wymeditor/',
			skinPath : '/js/libs/wymeditor/skins/default/',
			postInit : null,
			updateSelector : '.wym-save',
			updateEvent : 'click'
		};
		
		if( typeof localWymConfig != 'undefined' ){
			wymConfig = jQuery.extend({}, wymConfig, localWymConfig);
		}

		jQuery.getScript('/js/libs/wymeditor/jquery.wymeditor.js', function(){
			jQuery.getScript('/js/libs/wymeditor/plugins/embed/jquery.wymeditor.embed.js');
			jQuery('.form-wymeditor').each(function(index,el){
				jQuery(el).wymeditor( wymConfig );
			});					
		});
}
function d_form_datepicker()
{	num_datefields=0;
	jQuery("[data-popup=date]").each(function(){
		jQuery(this).addClass("datepicker datepicker-start datepicker-en datetime");
		num_datefields=num_datefields+1;	
	});
	if(num_datefields>0)
	{	include_css("//www.aber.ac.uk/css/mylibs/datepicker.css");
		jQuery.getScript("/js/libs/datepicker.js", function() {
			jQuery('.datepicker-en').Zebra_DatePicker({
				format: 'd/m/Y',
				show_icon:false,
				readonly_element:false
			});
			jQuery('.datepicker-en-start').Zebra_DatePicker({
				direction : true,
				pair : jQuery('.datepicker-en-end'),
				readonly_element:false
			});
			jQuery('.datepicker-en-end').Zebra_DatePicker({
				direction : [true, false],
				readonly_element:false
			});
		});	
	}
	jQuery("[data-popup=date]").each(function(){
		jQuery(this).on("click", function(){
			jQuery('.Zebra_DatePicker').addClass('dform-datepicker');
			setTimeout("jQuery('.Zebra_DatePicker').css({'left':'25%', 'border':'2px solid black', 'width':'350px'});", 30);
			setTimeout("jQuery('.Zebra_DatePicker .dp_header, .Zebra_DatePicker .dp_footer, .Zebra_DatePicker .dp_monthpicker, .Zebra_DatePicker .dp_yearpicker').css({'width':'100%'});", 30);
		})	
	});
}
function localise_date_validation()
{	jQuery.validator.methods.date = function(value, element) {
		var dateRegex = /^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
		return this.optional(element) || dateRegex.test(value);
	};
}

function countInstances(string, word) {
   var substrings = string.split(word);
   return substrings.length - 1;
}

function element_option()
{	jQuery("#add_element_list_item").on("click", function(event){
		event.preventDefault();
		element_add_item_click();
	});
	jQuery("#Element_type").on("change", function(){
		
		element_option_change();
	});
	curr_type=jQuery("#Element_type").val();
	if(curr_type=="ul" || curr_type=="ol")
	{	populate_existing_elements();
	}
	element_option_change();
}
function element_option_change()
{	jQuery("#element_text_container").removeClass("hidden");
	jQuery("#element_options_container").addClass("hidden");
	
	curr_type=jQuery("#Element_type").val();
	if(curr_type=="ul" || curr_type=="ol")
	{	jQuery("#element_text_container").addClass("hidden");
		jQuery("#element_options_container").removeClass("hidden");
		populate_existing_elements();
	}
}

function element_add_item_click()
{	elem_en_option_count=elem_en_option_count+1;
	elem_cy_option_count=elem_cy_option_count+1;
	jQuery("#element_option_column_en").append("<input class='element-option en' type='text' id='element-option-en-"+elem_en_option_count+"' value=''/>");
	jQuery("#element_option_column_cy").append("<input class='element-option cy' type='text' id='element-option-cy-"+elem_cy_option_count+"' value=''/>");
	activate_elem_keyup();

	//console.log("button clicked");
}

function replacer(match) {
  return match.replace(/'/g,'"');
}

function populate_existing_elements()
{	//console.log("looking");
	jQuery("#element_option_column_en").empty();
	jQuery("#element_option_column_cy").empty();
	elem_en=jQuery.trim(jQuery("#Element_text_en").val().replace(/<br>/g,"").replace(/'[^\<]+(?=\>)/g, replacer).replace(/'/g,'&#39;'));
	elem_cy=jQuery.trim(jQuery("#Element_text_cy").val().replace(/<br>/g,"").replace(/'[^\<]+(?=\>)/g, replacer).replace(/'/g,'&#39;'));
	elem_en_parts=elem_en.split("~");
	elem_cy_parts=elem_cy.split("~");
	jQuery.each(elem_en_parts, function( index, value ){
		elem_en_option_count=elem_en_option_count+1;
		jQuery("#element_option_column_en").append("<input class='element-option en' type='text' id='element-option-en-"+index+"' value='"+value+"'/>");
	});
	jQuery.each(elem_cy_parts, function( index, value ){
		elem_cy_option_count=elem_cy_option_count+1;
		jQuery("#element_option_column_cy").append("<input class='element-option cy' type='text' id='element-option-cy-"+index+"' value='"+value+"'/>");
	});
	if(jQuery('.element-option').length>0)
	{	activate_elem_keyup();
	}
	
}

function activate_elem_keyup()
{	
	jQuery(".element-option").each(function(){
		jQuery(this).on("keyup", function(){
			en_mod_options=[];
			cy_mod_options=[];
			jQuery(".element-option.en").each(function(){
				if(jQuery(this).val().trim()!="")
				{	en_mod_options.push(jQuery(this).val());
				}
			});
			jQuery(".element-option.cy").each(function(){
				if(jQuery(this).val().trim()!="")
				{	cy_mod_options.push(jQuery(this).val());
				}
			});
			jQuery("#Element_text_en").val(en_mod_options.join("~"));
			jQuery("#Element_text_cy").val(cy_mod_options.join("~"));
		});
	});

}


function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function generate_resume_pin()
{	email_to_validate=$("#to_email").val();
			if (validateEmail(email_to_validate)) {
				var min = 100000;
				var max = 999999;
				var num = Math.floor(Math.random() * (max - min + 1)) + min;
				var my_unique=email_to_validate+''+Math.floor(Date.now() / 1000);
				
				var my_unique_hash=my_unique.hashCode();
				qsid=$("#questionset_id").val();
				$('#to_resume_pin').html(num);
				$('#resume_pin').val(num);
				$('#resume_email').val(email_to_validate);
				$('#resume_token').val(my_unique_hash);
				$('#resume_pin_desc').removeClass("hidden");
							
				$("#submission_id").val($("#sessionTimeout").data("submissionid"));
				$("#page_frame").val($("#sessionTimeout").data("pageframe"));
				$("#resume_redirect").val($("#sessionTimeout").data("redirect"));
				$("#resume_submit").val($("#sessionTimeout").data("submit"));
				$("#initial_qs").val($("#sessionTimeout").data("initial_qs"));
				$("#resume_qs").val(qsid);
				$("#resume_cms").val($("#sessionTimeout").data("cms"));
				$("#resume_submit").val($("#sessionTimeout").data("resume_submit"));

				//preserve_form_json=$('#form-'+qsid).serializeArray().reduce(function(a, x) { a[x.name] = x.value; return a; }, {});
				var formJqObj = $("#form-"+qsid);
				var formDataObj = {};
				(function(){
					formJqObj.find(":input").not("[type='submit']").not("[type='reset']").each(function(){
						var thisInput = $(this);
						formDataObj[thisInput.attr("name")] = thisInput.val();
					});
				})();
				preserve_form_json=JSON.stringify(formDataObj);
				payload=btoa(preserve_form_json);

				$("#resume_payload").val(payload);
				$("#application_resume_dialog").removeClass("hidden");
				
				
			  } else {
				$("#to_email").addClass("resume_email_not_valid");
				$('#resume_pin_desc').addClass("hidden");
			  }	
}


function followupWizard()
{	$("input[name=group2]").on("change", function(){
		to_call=$("input[name=group2]:checked").val();
		window[to_call]();
	});
}

function followup_setup()
{	
	$.getScript( "/formbuilder-assets/js/jquery.serializeJSON.min.js" )
	.done(function( script, textStatus ) {
		console.log( textStatus );
	});
	if($("#final_rule").val()!="")
	{	load_fu_from_finalrule();
	}
	if(window.mode=="sf_fu_sf" || window.mode=="mfa_fu_sf")
	{	
		$.each(window.inital, function (index, value) {
		  if(value.type=="question")
		  {	  encoded_labels=window.questionbank[value.id].option_labels_encoded;
			  tre=encoded_labels.replace(/ ~/g, "~").replace(/ ~/g, "~").split("|");			  
			  test=null;
			  if(tre.length>1){
				test='{'+tre+'}';
			  }
			  //$("#initial").append("<span class='initial-question' data-qs-id='"+value.qs_id+"' data-id='"+value.id+"' data-option-values='"+window.questionbank[value.id].options_encoded+"' data-option-value-labels=\""+test+"\"  data-type='"+window.questionbank[value.id].type+"'>"+window.questionbank[value.id].question+"</span><br />");
			  $("#initial").append("<label for='initial_checkbox_"+value.qs_id+"_"+value.id+"'><input data-id='"+value.id+"' class='initialcheckboxes' type='checkbox' data-qs-id='"+value.qs_id+"' id='initial_checkbox_"+value.qs_id+"_"+value.id+"' name='initial[]' value='"+value.id+"'  data-question-text='"+window.questionbank[value.id].question+"' data-option-values='"+window.questionbank[value.id].options_encoded+"' data-option-value-labels=\""+test+"\"  data-type='"+window.questionbank[value.id].type+"' ><span>"+window.questionbank[value.id].question+"</span></label><br />");
			  
			  //<span class='initial-question' data-qs-id='"+value.qs_id+"' data-id='"+value.id+"' data-option-values='"+window.questionbank[value.id].options_encoded+"' data-option-value-labels=\""+test+"\"  data-type='"+window.questionbank[value.id].type+"'>"+window.questionbank[value.id].question+"</span><br />");
		  }
		});
		$.each(window.follow_up, function (index, value) {
		  if(value.type=="question")
		  {	//$("#follow_up").append("<span class='followup-questionset' data-qs-id='"+value.qs_id+"' data-id='"+value.id+"' >"+window.questionbank[value.id].question+"</span><br />");			  
			  $("#follow_up").append("<label for='followup_checkbox_"+value.qs_id+"_"+value.id+"'><input class='followupcheckboxes' type='checkbox' data-qs-id='"+value.qs_id+"' id='followup_checkbox_"+value.qs_id+"_"+value.id+"' name='followup[]' value='"+value.id+"' data-qb-id='"+value.id+"'  data-option-values='"+window.questionbank[value.id].options_encoded+"'  data-question-text='"+window.questionbank[value.id].question+"' data-option-value-labels=\""+test+"\"  data-type='"+window.questionbank[value.id].type+"' ><span>"+window.questionbank[value.id].question+"</span></label><br />");
		  }
		});
	}
	
	$("#initial-proceed").on("click", function(){
		to_process=[];
		checkedValues = $('.initialcheckboxes:checked').map(function() {
			return $(this).attr("id");
		}).get();
		$("#initial-container").css("display", "none");
		$("#followup-container").css("display", "initial");
		to_process.push({"initial":checkedValues});
	});
	$("#followup-proceed").on("click", function(){
		checkedValues = $('.followupcheckboxes:checked').map(function() {
			return $(this).attr("id");
		}).get();
		$("#followup-container").css("display", "none");
		to_process.push({"followup":checkedValues});
		processChecked(to_process);
	});
	
	var qb_options={};
	var condition_counter=0;
	var action_counter=0;
	
	$("#rules-add-button").on("click", function(event){
		rule=processForm();
		$("#final-rules-area").append("<li id='fu_"+$("#rule_id").val()+"'>"+$("#rule-desc").val()+"<span class='rule-removal'><a onclick='removeFollowupRule(\""+$("#rule_id").val()+"\")'>X</a></span></li>");
		all_folloup_rules.push(jQuery.parseJSON(rule));
		final_folloup_rules.push(rule);
		$("#final-rule").val(JSON.stringify(all_folloup_rules));
		$("#save-button").removeClass("hidden");
		//console.log(final_folloup_rules);
		$("#rules-add-button").addClass("hidden");
		$("#rules-area").empty();
		$(".initialcheckboxes").each(function(){
			$(this).attr("checked",false);
		});
		$(".followupcheckboxes").each(function(){
			$(this).attr("checked",false);
		});
		to_process=[];
		$("#initial-container").css("display", "block");
		console.log("on add");
		console.log(all_folloup_rules);
		event.preventDefault();
	});
	
}

function sf_fu_sf()
{	$("#relation").empty();
	$("#relation").append(build_folloup_select("initial_questionset_id", "Initial Questionset", window.available_qs));
	$("#relation").append(build_folloup_select("questionset_id", "Follow Up Questionset", window.all_qs));
}
function sf_fu_mfa()
{	$("#relation").empty();
	$("#relation").append(build_folloup_select("initial_application_id", "Initial Application", window.available_apps));	
	$("#relation").append(build_folloup_select("questionset_id", "Follow Up Questionset", window.all_qs));
}
function mfa_fu_sf()
{	$("#relation").empty();
	$("#relation").append(build_folloup_select("initial_questionset_id", "Initial Questionset", window.available_qs));
	$("#relation").append(build_folloup_select("application_id", "Follow Up Application", window.all_apps));
}
function mfa_fu_mfa()
{	$("#relation").empty();
	$("#relation").append(build_folloup_select("initial_application_id", "Initial Application", window.available_apps));
	$("#relation").append(build_folloup_select("application_id", "Follow Up Application", window.all_apps));
}

function load_fu_from_finalrule()
{	if($("#final-rule").val()!=="")
	{	obj = JSON.parse($("#final-rule").val());
		$.each(obj, function( index, value ) {
			all_folloup_rules.push(value);
			$("#final-rules-area").append("<li id='fu_"+value.Rule.id+"'>"+value.Rule.description+"<span class='rule-removal'><a onclick='removeFollowupRule(\""+value.Rule.id+"\")'>X</a></span></li>");
		});
	}
	console.log("initial load");
	console.log(all_folloup_rules);
}

function build_folloup_select(name, label, json_source)
{	template="<p><label for='{{name}}'>{{label}}</label><br /><select name='FollowUp[{{name}}]' id='{{name}}'><option value=''>Please Select</option>{{options}}</select></p>";
	option_template="<option value='{{value}}'>{{option_label}}</option>";
	options="";
	jQuery.each(json_source, function(index, value) {
	  this_option=option_template;
	  this_option=this_option.replace("{{value}}", value.id);
	  this_option=this_option.replace("{{option_label}}", value.name);
	  options=options+this_option;
	});
	returnable=template;
	returnable=returnable.replace("{{options}}", options);
	returnable=returnable.replace(/{{name}}/g, name);
	returnable=returnable.replace(/{{label}}/g, label);
	return returnable;
}

function removeFollowupRule(fur_id)
{	final_rules=[];
	$("#fu_"+fur_id).remove();
	obj = JSON.parse($("#final-rule").val());
	$.each(obj, function( index, value ) {
		if(value.Rule.id!==fur_id)
		{	final_rules.push(value);
		}
	});
	$("#final-rule").val(JSON.stringify(final_rules));
}

function FixSwitcher()
{	alt_lang_uri=curr_full_uri=window.location.href;
	if(curr_full_uri.indexOf("/en/") !== -1)
	{	alt_lang_uri=alt_lang_uri.replace("/en/", "/cy/");
	}
	if(curr_full_uri.indexOf("/cy/") !== -1)
	{	alt_lang_uri=alt_lang_uri.replace("/cy/", "/en/");
	}
	$("#language-toggle a").attr("href", alt_lang_uri);	
}

function objectifyForm(formArray) {//serialize data function

  var returnArray = {};
  for (var i = 0; i < formArray.length; i++){
    returnArray[formArray[i]['name']] = formArray[i]['value'];
  }
  return returnArray;
}


function getLang()
{	lang="en";
	if(window.location.href.indexOf("/cy/") !== -1)
	{	lang="cy";
	}
	return lang;
}

function processChecked(process_obj)
{	var effects=[];
	var description="";
	initial=process_obj[0];
	console.log(initial);
	followup=process_obj[1];
	condition_counter=0;
	action_counter=0;
	had_values=0;
	$("#rules-area").empty();	
	base_rule='{"cause":{"conditions":[';
	description=description+"If the following condition(s) are met - *rn*";
	$.each(initial.initial, function( index, value ) {
		this_questionset_id=$("#"+value).data("qs-id");
		console.log("condition qs_id "+this_questionset_id);
		if(condition_counter>0)
		{	base_rule=base_rule+', ';
		}
		base_rule=base_rule+'{"tmp_id":"'+this_questionset_id+'", "questionset_id":"'+this_questionset_id+'", "counter":"'+condition_counter+'", "questionbank_id":"'+$("#"+value).data("id")+'", "question_text":"'+encodeURI($("#"+value).data("question-text"))+'" ';
		description=description+" "+(condition_counter+1)+") In Form "+this_questionset_id+" if question "+$("#"+value).data("question-text");
		description=description+" is *equal_cond_"+condition_counter+"_end_equal* to *equal_to_"+condition_counter+"_end_equal* *rn*";
		
		if($("#"+value).data("option-values")!==null){		
			base_rule=base_rule+', "has_options":"true", "options":{"values":["'+$("#"+value).data("option-values").replace(/\|/g, '","')+'"], "option_value_labels":'+transform_assoc($("#"+value).data("option-value-labels").replace(/~/g, '"'))+'}';			
			had_values=1;
		}	
		else
		{	base_rule=base_rule+'}';
		}
		condition_counter++;
	});
	if(had_values==1)
	{	base_rule=base_rule+'}';
	}
	base_rule=base_rule+']}<!--effect_placeholder--><!--description_placeholder-->}';
	$("#rules-area").append(base_rule);	
	effect=', "effect": {"actions":[';
	description=description+'*rn*Then perform the action(s): *rn*';
	$.each(followup.followup, function( index, value ) {
		this_questionset_id=$("#"+value).data("qs-id");
		if(action_counter>0)
		{	effect=effect+', ';
		}
		effect=effect+'{"questionset_id":"'+$("#"+value).data("qs-id")+'", "action":"exclude", "counter":"'+action_counter+'", "questionbank_id":"'+$("#"+value).data("qb-id")+'", "question_text":"'+encodeURI($("#"+value).data('question-text'))+'"}';
		description=description+' Exclude question '+$("#"+value).data('question-text')+' from Form '+$("#"+value).data("qs-id")+" *rn*";
		action_counter=action_counter+1;
	});
	effect=effect+']}';
	$("#rules-area").html($("#rules-area").html().replace('<!--effect_placeholder-->', effect));
	$("#rules-area").html($("#rules-area").html().replace('<!--description_placeholder-->', ', "description":"'+encodeURI(description)+'"'));
	$.ajax({
			  url: "../rulerenderer/?obj="+$("#rules-area").html(),
			  context: document.body
			}).done(function(data) {
				$("#rules-area").html(atob(data));
				$(".set-condition-operand").on("change", function(){
					dest_id='#equal-cond-'+$(this).data("condition-operand-id");
					src_id='set-condition-operand-'+$(this).data("condition-operand-id");
					$(dest_id).html($('select[id='+src_id+'] option:selected').text());
					$("#rule-desc").val($("#rule-desc-html").html());
				});
				$(".set-condition-to").on("change keyup", function(){
					dest_id='#equal-to-'+$(this).data("condition-to-id");
					src_id='set-condition-to-'+$(this).data("condition-to-id");
					//console.log($(this).data("type"));
					if($(this).data("type")=="select")
					{	$(dest_id).html($('select[id='+src_id+'] option:selected').text());
					}
					else
					{	$(dest_id).html($(this).val());
					}
					$("#rule-desc").val($("#rule-desc-html").html());
					//console.log("set-condition-to changed "+$(this).data("condition-to-id"));
				});
			});
	
	$("#rules-add-button").removeClass("hidden");
}
	
function transform_assoc(obj)
{	json = JSON.parse(obj);
	console.log(json);
	formatted=[];
	$.each(json, function(k, v) {
        //display the key and value pair
        formatted.push({"key":k, "value":v});
       
    });
    return JSON.stringify(formatted);
}

function createSelectOption(value, label)
{	return "<option value='"+value+"'>"+label+"</option>";
}

function add_step_row(line)
{	line="<div class='step-line'><input type='hidden' name='Steps["+line+"][step_number]' value='"+line+"'/><label class='wizard-label'>Step Label(EN)</label><input  placeholder='e.g. `About You`' title='Please keep these as short as possible'   class='wizard-textinput' name='Steps["+line+"][step_label_en]'/><label  class='wizard-label'>Step Label(CY)</label><input  placeholder='e.e. `Amdanoch chi`' title='Cadwch y rhain mor fyr â sy`n posibl' class='wizard-textinput' name='Steps["+line+"][step_label_cy]'/>";
	jQuery("#step_names").append(line);
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function processForm()
{	return JSON.stringify($('#rules-area form:first-of-type').serializeJSON());
	
}
$.fn.serializeAssoc = function() {
    var formData = {};
    this.find('[name]').each(function() {
        formData[this.name] = this.value;  
    })
    return formData;
};
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function register_rule_add_click()
{	console.log ("rule add");	
}


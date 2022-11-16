(function(jQuery) {

	jQuery.fn.extend({
		/* A jQuery plugin for AU to allow easy integration into forms of our subscription to Postcoder (https://postcoder.com/)
		 * Usage:
		 *
		 * HTML: <div id="postcoder"></div>
		 * JS: $("#postcoder").aupostcoder("en", true, false, "country", "address_line_1", "address_line_2", "post_town", "post_code");
		 *
		 * Recommended that the div that will contain the postcoder be in close proximity to the country form field
		 *
		 * The function takes the following parameters
		 * param_lang - the language to use (en or cy) - defaults to en
		 * param_country_uses_fm_abbr - does the country code form input use Form Managaer Abbreviations - defaults to false
		 * param_hidden_default - should the postcoder form be initially visible or not - defaults to true (visible)
		 * param_country_field - the id of the form field input from which to retrieve the country code
		 * param_addressline1 - the id of the form field input into which the address 1 line will be populated
		 * param_addressline2 - the id of the form field input into which the address 2 line will be populated
		 * param_posttown - the id of the form field input into which the post town line will be populated
		 * param_postcode - the id of the form field input into which the post code line will be populated
		 *
		 * The country_field values should be a international country codes as for example in the `countries` table in pubdb
		 * This script assumes that the form fields we are interacting with are each properly nested in a form-group div e.g.
		 * <div class="form-group">
		 * 		<label for="postcode">Postcode</label>
		 * 		<input type="text" id="postcode" name="postcode" />
		 * </div>
		*/
		AUPostcoder: function(param_lang, param_country_uses_fm_abbr, param_hidden_default, param_country_field, param_addressline1, param_addressline2, param_posttown, param_postcode) {
			/*initiate the global variables to reflect the passed in parameters*/
			var lang ="en";
			if(param_lang=="cy")
			{ lang ="cy";
			}

			var country_uses_fm_abbr = false;
			if (param_country_uses_fm_abbr===true)
			{	country_uses_fm_abbr = true;
			}

			var hidden_default = "";
			if(param_hidden_default===true)
			{	hidden_default = "hidden";
			}

			var country_field = param_country_field;
			var target_addressline1 = param_addressline1;
			var target_addressline2 = param_addressline2;
			var target_posttown = param_posttown;
			var target_postcode = param_postcode;
			var populate_elements=[target_addressline1, target_addressline2, target_posttown, target_postcode];

			/*Initiate other global variables*/
			var api_key = "PCW3T-J34FW-5659R-LZ3YW";
			var closeModal;
			var container_div_id=$(this).attr("id");
			var page_type="snow-white";
			var form_group_class="fm-snow-white";
			var bodyclass = $("body").attr('class');
			if (typeof bodyclass !== typeof undefined && bodyclass !== false) {
				page_type="au-generic";
				form_group_class="fm-au-generic";
			}
			var dict={"en":{
							search_field_text:"Search for address or post/zip code",
							placeholder: "e.g. Manor Farm Barns, Framingham Pigot or NR14 7PZ or 95124",
							search_text: "Search",
							searching_addresses: "Searching addresses",
							selected_address_populated: "selected, address fields populated",
							address_heading:"Please select an address from below",
							over_100:"addresses found, click to show next 100",
							addresses_found:"addresses found",
							no_addresses_found:"No addresses found",
							error_occured:"Error occurred",
							reset_label:"reset address lookup",
							please_check:"Please check the populated address fields and ammend as appropriate",
							set_country:"Please set your country before searching"
							},
					  "cy":{
							search_field_text:"Chwilio am gyfeiriad neu god post",
							placeholder: "e.e. Manns Farm Barns, Framingham Pigot neu NR14 7PZ",
							search_text: "Chwilio",
							searching_addresses: "Chwilio am gyfeiriadau",
							selected_address_populated: "wedi\'i ddewis, meysydd cyfeiriad wedi eu llenwi",
							address_heading:"Dewiswch gyfeiriad isod",
							over_100:"o gydeiriadau wedi\'i canfod , cliciwch i ddangos y 100 nesaf",
							addresses_found:"o gydeiriadau wedi\'i canfod",
							no_addresses_found:"Ni ddarganfuwyd unrhyw gyfeiriadau",
							error_occured:"Bu Gwall",
							reset_label:"ailosod chwilotwr cyfeiriad",
							please_check:"Gwiriwch y meysydd cyfeiriad a a'u newid fel y bo'n briodol",
							set_country:"Gosodwch eich gwlad cyn chwilio"
							}
					};

			//empty the div before we start
			$(this).empty();

			this.each(function(){
				var form_html='<form id="postcoder_form" class="'+hidden_default+'">\
								<div class="address_container">\
									<div class="form-group '+form_group_class+'">\
										<label class="ui-dform-label" for="address">'+dict[lang].search_field_text+'</label>\
										<p><em><small>'+dict[lang].set_country+'</small></em></p>\
										<input type="text" class="ui-dform-text" id="address" placeholder="'+dict[lang].placeholder+'" aria-owns="address_result" autocomplete="off" autocorrect="off">\
									</div>\
									<button type="button" class="btn btn-default" id="search">'+dict[lang].search_text+'</button>\
									<div class="modal">\
									<span class="close cursor" onclick="closeModal();">&times;</span><div id="address_results"></div><div id="address_status" aria-live="assertive" aria-atomic="true" role="status" class="sr-only"></div></div>\
								</div>\
							</form>\
							<script> function closeModal(){$(".modal").each(function(){$(this).css("display", "");});} </script>\
							<style>\
								.modal { display: none; position: fixed; z-index: 1; padding-top: 100px; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color:rgba(0, 0, 0, 0.8);}\
								.address-picker-list{	 position: relative;  background-color: #fefefe;  margin: auto; padding: 0.4em 0.4em 0.4em 0.6em; width: 90%; max-width: 1200px;}\
								.close { color: white; position: absolute; top: 10px; right: 25px; font-size: 35px; font-weight: bold;}\
								.close:hover, .close:focus { color: #999; text-decoration: none; cursor: pointer; }\
								.content-primary form#postcoder_form { margin-left:0; }\
								#postcoder_form { padding:0.6em 0.5em; background:#f9f9f9;}\
								#postcoder_form label.ui-dform-label{ text-transform: none!important; font-weight:300; font-size: 22px; line-height: .83333; padding-bottom:0.2em; font-family: MPlantin, Georgia, Times, \'Times New Roman\', serif;}\
							</style>	';
				$(this).append(form_html);
				$("#postcoder_form").validate();

				$.each(populate_elements, function(index, populate_element){
					$("#"+populate_element).parent().removeClass("val-good");
					$("#"+populate_element).parent().removeClass("val-error");
					$("#"+populate_element).parent().addClass("hidden");
					$("#"+populate_element).val("");
				});
				// $("#postcoder_form").on("submit", function(e) {
				$("#postcoder_form #search").on("click", function(e) {
					e.preventDefault();
					address_search("#address", "#address_results", "#address_status");
				});
			});

			var address_search=function(input_element, address_results, status_element, page) {

				var page = page || 0;

				var address = $(input_element).val().trim();

				if (address != "") {

					// Remove any previous validation results
					if(page == 0) $(address_results).empty();

					// Create a loading message
					var loading_html = $("<div></div>", {
						id: "address_loading",
						text: dict[lang].searching_addresses+"..."
					});
					$(input_element).after(loading_html);

					$(status_element).text(dict[lang].searching_addresses);

					// Country hard coded to UK for this example
					var country_code = default_country_code = "UK";

					country_code=$("#"+ country_field).val().toUpperCase()
					if(country_uses_fm_abbr===true)
					{	//form manager abbreviations with country code have them in a format like cc_uk, cc_de OR acc_uk, acc_de so we'll only need to take the part after the underscore
						cc_parts=$("#"+ country_field).val().toUpperCase().split("_");
						country_code=cc_parts[1];
					}

					if (typeof(country_code) == "undefined")
					{	country_code=default_country_code;
					}

					// Create the URL to API including API key and encoded search term
					var address_url = "https://ws.postcoder.com/pcw/" + api_key + "/address/"+country_code+"/" + encodeURIComponent(address) + "?lines=2&page=" + page;

					// Call the API
					$.ajax({
						url: address_url
					}).done(function(data) {

						$("#address_loading").remove();

						// For only one result, simply populate the fields, rather than asking the user to select from list
						if (data.length == 1) {

							select_address(data[0], address_results, status_element);

							$(status_element).text("\"" + data[0].summaryline + "\" "+dict[lang].selected_address_populated);

						} else if (data.length > 1) {

							$(address_results).append("<h3>"+dict[lang].address_heading+"</h3>");
							$.each(data, function(index, item) {

								var address_option = $("<div></div>", {
									class: "radio",
									click: function(e) {
										// Only trigger if it's a click with the mouse, not caused by using arrow keys
										if (e.type === "click" && e.offsetX !== 0 && e.offsetY !== 0) {
											e.preventDefault();
											select_address(item, address_results, status_element);
										}
									},
									keydown: function(e) {
										// When using the keyboard, on return/enter select the item
										var code = e.keyCode || e.which;
										if(code == 13) {
											e.preventDefault();
											select_address(item, address_results, status_element);
										}
									}
								}).append(
									$("<label></label>", {
										text: item.summaryline
									}).prepend(
										$("<input>", {
											type: "radio",
											name: "address_radio",
											id: "address_" + page + "_" + index,
											value: index
										})
									)
								);
								$(address_results).addClass("address-picker-list");
								$(address_status).addClass("address-picker-list");
								$(".modal").each(function(){
									$(this).css("display", "initial");
								});

								$(address_results).append(address_option);

							});

							// Check if we have more than one page of results (Slight edge case)
							// Either let your user page through the results using button or
							// show a message to encourage them to refine their search.
							// Typically adding a house number or name along with postcode helps

							var last_index = data.length - 1;

							// Remove existing more button, if exists
							$("#show_more_button").remove();

							if (data[last_index].morevalues) {

								// Create the more button and add some context to text, using totalresutls element
								var show_more_button = $("<button>", {
									text: data[last_index].totalresults + " "+dict[lang].over_100,
									id: "show_more_button",
									click: function(e) {
										e.preventDefault();

										address_search(input_element, address_results, status_element, data[last_index].nextpage);
									}
								});

								// Insert button at end of existing results
								$(address_results).append(show_more_button);

								// Accessible status message to say more than 100 addresses
								$(status_element).text(data[last_index].totalresults + " "+over_100);

							} else {

								$(status_element).text(data.length + " "+dict[lang].addresses_found);

							}

						} else {

							$(address_results).text(dict[lang].no_addresses_found);

							$(status_element).text(dict[lang].no_addresses_found);

						}

					}).fail(function(error) {

						loading_html.remove();

						$(status_element).text(dict[lang].errorr_occured);

						$(address_results).text(dict[lang].errorr_occured);

						// Triggered if API does not return HTTP code between 200 and 399
						// More info - https://developers.alliescomputing.com/postcoder-web-api/error-handling

					});

				} else {

					// Could show an "Address search term is required" message here

				}

			}

			var select_address=function(address, address_results, status_element) {

				$(address_results).empty();

				$(status_element).text("\"" + address.summaryline + "\" "+dict[lang].selected_address_populated);

				// Populate fields
				$("#"+target_addressline1).val(address.addressline1 || "");
				$("#"+target_addressline2).val(address.addressline2 || "");
				$("#"+target_posttown).val(address.posttown || "");
				$("#"+target_postcode).val(address.postcode || "");
				$("#"+target_addressline1).parent().removeClass("hidden");
				$("#"+target_addressline2).parent().removeClass("hidden");
				$("#"+target_posttown).parent().removeClass("hidden");
				$("#"+target_postcode).parent().removeClass("hidden");
				$(address_results).removeClass("address-picker-list");
				$("#postcoder_form").remove();
				$("#"+container_div_id).replaceWith("<div id='"+container_div_id+"'></div>");
				$("#"+container_div_id).append("<p><small><em>"+dict[lang].please_check+"</em></small></p>")
				$("#"+container_div_id).append("<style>.reset-postcoder {text-decoration:underline; display:block; margin-bottom:1.3em;} .reset-postcoder:hover, .reset-postcoder:focus {  text-decoration: none;  cursor: pointer;}</style><span class='reset-postcoder' onClick='reinsertLookup()'>"+dict[lang].reset_label+"</span><script>function reinsertLookup(){$('#"+container_div_id+"').aupostcoder('"+lang+"', "+country_uses_fm_abbr+", false, '"+country_field+"', '"+target_addressline1+"', '"+target_addressline2+"', '"+target_posttown+"', '"+target_postcode+"');}</script>");
				// Full list of response elements
				// https://developers.alliescomputing.com/postcoder-web-api/address-lookup

			}

			return this;
	}
	});

	jQuery.fn.extend({
		aupostcoder: jQuery.fn.AUPostcoder
	});

})(jQuery);

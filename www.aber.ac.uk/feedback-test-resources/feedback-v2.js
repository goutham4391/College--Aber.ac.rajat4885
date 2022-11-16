function form_callback()
{	//console.log("running");
	if(jQuery("#html-7").length>0)
	{	if(jQuery("#addition-backup").length>0)
		{	addition=jQuery("#addition-backup").html();
			jQuery("#html-7").before(addition);
			jQuery("#html-7").remove();
		}
		else
		{	jQuery("#html-7").remove();
		}
	}
	if(jQuery("#27").length>0)
	{	jQuery("#html-9").addClass("hidden");
		jQuery("#27").change(function() {
			jQuery("#html-9").addClass("hidden");
			if(jQuery("#27").val()=="Website Feedback")
			{	jQuery("#html-9").removeClass("hidden");
			}
		});
	}	
	jQuery("#695").on("change", function(){	
		if(jQuery("#695 input[type='radio']:checked").val()=="Website issues")
		{	jQuery("#html-9").removeClass("js-hidden");
		}
		else
		{	jQuery("#html-9").addClass("js-hidden");
		}
	});
}


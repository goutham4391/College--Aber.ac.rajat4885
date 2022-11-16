jQuery.fn.values = function(data) {
   var inps = jQuery(this).find(":input").get();

    if(typeof data != "object") {
       // return all data
        data = {};

        jQuery.each(inps, function() {
            if (this.name && (this.checked
                        || /select|textarea/i.test(this.nodeName)
                        || /text|hidden|password/i.test(this.type))) {
                data[this.name] = jQuery(this).val();
            }
        });
        return data;
    } else {
        jQuery.each(inps, function() {
            if (this.name && data[this.name]) {
                if(this.type == "checkbox" || this.type == "radio") {
                    jQuery(this).prop("checked", (data[this.name] == jQuery(this).val()));
                } else {
                    jQuery(this).val(data[this.name]);
                }
            } else if (this.type == "checkbox") {
                jQuery(this).prop("checked", false);
            }
       });
       return jQuery(this);
    }
};

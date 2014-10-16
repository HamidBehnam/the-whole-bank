/// <reference path="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js">

jQuery(document).ready(function () {
    jQuery(".editSection").hide();
    jQuery("#customers").on("click", "a.showHideEdit", function () {
        jQuery(this).parent().parent().siblings().find(".editSection").hide("slow");
        jQuery(this).parent().prev().children(".editSection").slideToggle("slow");
    });
    jQuery("#customers").on("click", "a.manage-service", function () {
        jQuery(this).parents(".panel.panel-default").siblings().find(".editSection").hide("slow");
        jQuery(this).parent().parent().next().slideDown("slow");
    });
    jQuery("#newCustomer").click(function () {
        jQuery(this).parents(".container").find(".editSection").hide();
    });

    jQuery("#searchInput").click(function () {
        jQuery(this).parents("#customers").find(".editSection").hide("slow");
    });

    jQuery(".error-message, .form-control-feedback").hide();
    
    jQuery(".container").on("idNotOK", "input", function () {
        jQuery(this).parent().parent().addClass("has-error has-feedback").find(".id-not-ok, .form-control-feedback").show();
    });

    jQuery(".container").on("OK", "input", function () {
        var theElement = jQuery(this).parent().parent();
        if (theElement.hasClass("has-error")) {
            theElement.removeClass("has-error").find(".error-message, .form-control-feedback").hide();
        }
    });

    jQuery(".container").on("leftEmpty", "input", function () {
        jQuery(this).parent().parent().addClass("has-error has-feedback").find(".required, .form-control-feedback").show();
    });

    jQuery("#theAlert").hide();

    var theTimer;
    jQuery("#theAlert").on("notificationGo", function () {
        if (theTimer) {
            clearTimeout(theTimer);
            jQuery(this).fadeOut("fast");
        }

        jQuery(this).fadeIn("slow");
        //var theTimer;
        theTimer = setTimeout(function () {
            jQuery("#theAlert").fadeOut("slow");
        }, 8000);
    });

    jQuery("#theAlert > a.close").click(function () {
        jQuery(this).parent().fadeOut("slow");
        clearTimeout(theTimer);
    });
});

function Banker(id, fName, lName, branch, phone, email) {
    this.id = id;
    this.firstName = fName;
    this.lastName = lName;
    this.branch = branch;
    this.phone = phone;
    this.email = email;
}

function Customer(id, fName, lName, dob, address, phone, email, memberFrom, originalBranch, services) {
    this.id = id;
    this.firstName = fName;
    this.lastName = lName;
    this.dateOfBirth = dob;
    this.address = address;
    this.phone = phone;
    this.email = email;
    this.memberFrom = memberFrom;
    this.originalBranch = originalBranch;
    this.services = services;
}

function Service(id, date, serviceDescription, bankerID) {
    this.id = id;
    this.serviceDate = date;
    this.description = serviceDescription;
    this.bankerId = bankerID;
}
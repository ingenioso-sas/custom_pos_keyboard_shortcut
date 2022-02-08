odoo.define('custom_pos.screens', function (require) {
    "use strict";

    var screens = require('point_of_sale.screens');
    var PopupWidget = require('point_of_sale.popups');
    var core = require('web.core');
    var gui = require('point_of_sale.gui');

    /* customizing product list widget search option */
    var ProductListWidget = screens.ProductListWidget.include({
        template: 'ProductListWidget',
        init: function(parent, options) {
            parent.t = this.template;
            var self = this;
            this._super(parent,options);

            this.keypress_product_handler = function(ev){
                // React only to SPACE to avoid interfering with warcode scanner which sends ENTER
                if (ev.which != 13) {
                    return;
                }
                ev.preventDefault();
                var product = self.pos.db.get_product_by_id(this.dataset.productId);
                options.click_product_action(product);
                // $(".selected-mode").focus();
                // $(".numpad").focus();
            };
        },
    });

    /* customizing product screen widget for shortcut */
    var ShortcutTipsWidget = PopupWidget.extend({
        template: 'ShortcutTipsWidget',
        show: function () {
            this._super();
        }
    });
    gui.define_popup({name: 'shortcuttips', widget: ShortcutTipsWidget});

    var ProductScreenWidget = screens.ProductScreenWidget.include({
        init: function(parent, options){

            this._super(parent,options);

            var self = this;

            this.actionpad = new screens.ActionpadWidget(this,{});
            this.actionpad.replace(this.$('.placeholder-ActionpadWidget'));

            this.numpad = new screens.NumpadWidget(this,{});
            this.numpad.replace(this.$('.placeholder-NumpadWidget'));

            this.product_screen_keydown_event_handler = function(event){

                console.log("Shortcut key which: "+event.which);
                
                /* product screen key down events */
                if(!$($(document).find(".product-screen")[0]).hasClass('oe_hidden')){
                    if(event.which == 113) {      // click on "F2" button
                        $(document).find("div.product-screen div.pads span#shortcut_tips_btn").trigger("click");
                    }
                }

                /* payment screen key down events */
                if(!$($(document).find("div.payment-screen")[0]).hasClass('oe_hidden')){
                    if (event.which == 27) {            // click on "Esc" button
                        $($(document).find("div.payment-screen")[0]).find("div.top-content span.back").trigger('click');
                    } else if(event.which == 76) {      // click on "l" button
                        $($(document).find("div.payment-screen")[0]).find("div.js_set_customer").trigger('click');
                    } else if (event.which == 73) {     // click on "i" button
                        $($(document).find("div.payment-screen")[0]).find("div.payment-buttons div.js_invoice").trigger('click');
                        return false;
                    } else if(event.which == 33) {      // click on "Page Up" button
                        if($($(document).find("div.payment-screen")[0]).find("div.paymentmethods div.highlight").length > 0){
                            var elem = $($(document).find("div.payment-screen")[0]).find("div.paymentmethods div.highlight");
                            elem.removeClass("highlight");
                            elem.prev("div.paymentmethod").addClass("highlight");
                        }else{
                            var payMethodLength = $($(document).find("div.payment-screen")[0]).find("div.paymentmethods div.paymentmethod").length;
                            if(payMethodLength > 0){
                                $($($(document).find("div.payment-screen")[0]).find("div.paymentmethods div.paymentmethod")[payMethodLength-1]).addClass('highlight');
                            }
                        }
                    } else if(event.which == 34) {      // click on "Page Down" button
                        if($($(document).find("div.payment-screen")[0]).find("div.paymentmethods div.highlight").length > 0){
                            var elem = $($(document).find("div.payment-screen")[0]).find("div.paymentmethods div.highlight");
                            elem.removeClass("highlight");
                            elem.next("div.paymentmethod").addClass("highlight");
                        }else{
                            var payMethodLength = $($(document).find("div.payment-screen")[0]).find("div.paymentmethods div.paymentmethod").length;
                            if(payMethodLength > 0){
                                $($($(document).find("div.payment-screen")[0]).find("div.paymentmethods div.paymentmethod")[0]).addClass('highlight');
                            }
                        }
                    } else if(event.which == 32) {      // click on "space" button
                        event.preventDefault();
                        $($(document).find("div.payment-screen")[0]).find("div.paymentmethods div.highlight").trigger("click");
                        $($(document).find("div.payment-screen")[0]).find("div.paymentmethods div.paymentmethod").removeClass("highlight");
                    } else if(event.which == 38) {      // click on "Arrow Up" button
                        if($($(document).find("div.payment-screen")[0]).find("table.paymentlines tbody tr.selected").length > 0){
                            $($(document).find("div.payment-screen")[0]).find("table.paymentlines tbody tr.selected").prev("tr.paymentline").trigger("click");
                        }else{
                            var payLineLength = $($(document).find("div.payment-screen")[0]).find("table.paymentlines tbody tr.paymentline").length;
                            if(payLineLength > 0){
                                $($($(document).find("div.payment-screen")[0]).find("table.paymentlines tbody tr.paymentline")[payLineLength-1]).trigger('click');
                            }
                        }
                    } else if(event.which == 40) {      // click on "Arrow Down" button
                        if($($(document).find("div.payment-screen")[0]).find("table.paymentlines tbody tr.selected").length > 0){
                            var elem = $($(document).find("div.payment-screen")[0]).find("table.paymentlines tbody tr.selected").next("tr.paymentline").trigger("click");
                            elem.removeClass("highlight");
                            elem.next("div.paymentmethod").addClass("highlight");
                        }else{
                            var payLineLength = $($(document).find("div.payment-screen")[0]).find("table.paymentlines tbody tr.paymentline").length;
                            if(payLineLength > 0){
                                $($($(document).find("div.payment-screen")[0]).find("table.paymentlines tbody tr.paymentline")[0]).trigger('click');
                            }
                        }
                    } else if(event.which == 46) {      // click on "Delete" button
                        event.preventDefault();
                        $($(document).find("div.payment-screen")[0]).find("table.paymentlines tbody tr.selected td.delete-button").trigger("click");
                    }
                }
                
                if(!$($(document).find(".product-screen")[0]).hasClass('oe_hidden')){
                    var isNotSearch = (!$(document).find("div.searchbox input").is(":focus"));
                    switch(event.keyCode) {
                        case 70: // F
                            if(event.ctrlKey) { // Ctrl + F
                                $(document).find("div.product-screen div.rightpane div.searchbox input").focus();
                                event.preventDefault();
                            }
                            break;
                        case 68: // D
                            if(event.ctrlKey || isNotSearch) { // Ctrl + D or D
                                self.numpad.state.changeMode('discount');
                                return false;
                            }
                            break;
                        case 80: // P
                            if(event.ctrlKey || isNotSearch) { // Ctrl + P or P
                                self.numpad.state.changeMode('price');
                                return false;
                            }
                            break;
                        case 67: // Ctrl+C
                            if(event.ctrlKey || isNotSearch) { // Ctrl + C or C
                                self.numpad.state.changeMode('quantity');
                            }
                            break;
                        case 9: // Ctrl+TAB
                            if(event.ctrlKey || isNotSearch) { // Ctrl + TAB or TAB
                                self.numpad.state.switchSign();
                                return false;
                            }
                            break;
                        case 72: // Ctrl+H
                            if(event.ctrlKey || isNotSearch) { // Ctrl + H or H 
                                $(document).find("div.product-screen header.rightpane-header span.breadcrumb-home").trigger('click');
                                return false;
                            }
                        case 76: // Ctrl+L
                            if(event.ctrlKey || isNotSearch) { // Ctrl + L or L
                                self.actionpad.gui.show_screen('clientlist');
                                return false;
                            }
                            break;
                        case 32: // Ctrl+Space
                            if(event.ctrlKey || isNotSearch) { // Ctrl + Space or Space
                                self.actionpad.gui.show_screen('payment');
                            }
                            break;
                        case 38: // Ctrl+Up
                            var fila=$(document).find("div.product-screen ul.orderlines li.selected").prev('li.orderline')
                            fila.trigger('click');
                            fila.focus()
                            break;
                        case 40: // Ctrl+Down
                            var fila=$(document).find("div.product-screen ul.orderlines li.selected").next('li.orderline')
                            fila.trigger('click');
                            fila.focus()
                            break;
                    }
                }
                /* clientlist screen key down events */
                if(!$($(document).find("div.clientlist-screen")[0]).hasClass('oe_hidden')){
                    
                    console.log("switch: "+event.which+" - ctrlKey:"+event.ctrlKey+" - keyCode:"+event.keyCode);
                    switch(event.which) {
                        case 70: // F
                            console.log("Shortcut key pressed: "+event.keyCode+" - ctrlKey:"+event.ctrlKey);
                            if(event.ctrlKey) {
                                $(document).find("div.clientlist-screen span.searchbox input").focus();
                                event.preventDefault();
                            }
                            break;
                        case 27: // Esc
                            $($(document).find("div.clientlist-screen")[0]).find("span.back").trigger('click');
                            break;
                        case 38: // Arrow Up
                            var fila=$(document).find("div.clientlist-screen table.client-list tbody.client-list-contents tr.highlight")
                            if(fila.length > 0){
                                fila.prev("tr.client-line").click();
                                fila.focus()
                            }else{
                                fila = $(document).find("div.clientlist-screen table.client-list tbody.client-list-contents tr.client-line")
                                var clientLineLength = fila.length;
                                if(clientLineLength > 0){
                                    $(fila[clientLineLength-1]).click();
                                    $(fila[clientLineLength-1]).focus();
                                }
                            }
                            break;
                        case 40: // Arrow Down
                            var fila=$(document).find("div.clientlist-screen table.client-list tbody.client-list-contents tr.highlight")
                            if(fila.length > 0){
                                fila.next("tr.client-line").click();
                            }else{
                                fila = $(document).find("div.clientlist-screen table.client-list tbody.client-list-contents tr.client-line")
                                var clientLineLength = fila.length;
                                if(clientLineLength > 0){
                                    $(fila[0]).click();
                                }
                            }
                            break;
                        case 13: // Enter
                            if(!$(document).find("div.clientlist-screen section.top-content span.next").hasClass('oe_hidden')){
                                $(document).find("div.clientlist-screen section.top-content span.next").click();
                            }
                            return false;
                        case 107: // click on numpad "+" button
                            $(document).find("div.clientlist-screen section.top-content span.new-customer").click();
                            $(document).find("div.clientlist-screen section.full-content section.client-details input.client-name").focus();
                            event.preventDefault();
                            break;
                    }
                }

                /* receipt screen key down events */
                if(!$($(document).find("div.receipt-screen")[0]).hasClass('oe_hidden')){
                    if(event.which == 73){   // click on "i" button
                        $($(document).find("div.receipt-screen")[0]).find("div.print_invoice").trigger("click");
                    } else if(event.which == 82){   // click on "r" button
                        $($(document).find("div.receipt-screen")[0]).find("div.print").trigger("click");
                    } else if(event.which == 13){   // click on "Enter" button
                        $($(document).find("div.receipt-screen")[0]).find("div.top-content span.next").trigger("click");
                        return false;
                    }
                }

                /* shortcut tips modal key down events */
                if(!$($(document).find("div.modal-dialog-shortcut-tips")[0]).hasClass('oe_hidden')){
                    if(event.which == 27) {   // click on "Esc" button
                        $($(document).find("div.modal-dialog-shortcut-tips")[0]).find("footer.footer div.cancel").trigger("click");
                    }
                }
            };
            $(document).find("body").on('keydown', this.product_screen_keydown_event_handler);
        },
        show: function () {
            this._super();
            var self = this;
            $("#shortcut_tips_btn").on("click", function (event) {
                self.gui.show_popup("shortcuttips");
            });
        }
    });

    // return {
    //     'ShortcutTipsWidget': ShortcutTipsWidget
    // };
});
/*
     var options = {
            tableSelector :'#data-table',
            remoteFunction: {
                path: '...',
                arrayProperty: '...',
                params: '...'
            },
            columns: [
                {label: "Active", sortable: true, property: "isActive", formatAs: function(obj){
                    console.log(obj);
                    return 'asdf';
                }},
                {label: "Name", sortable: true, property: "name"},
                {label: "Description", sortable: false, property: "description"},
                {label: "Created Date", sortable: true, property: "createdDate", formatAs: "date", sortAs: "number"},
                {label: "Errors", sortable: true, property: "openErrorCount", sortAs: "number"},
                {label: "asdfsadf", sortable: true, property: "asdfasdf", sortAs: "number"},
            ],
            defaultSortIndex: 1,
            events: {
                loading: function() {},
                loadingComplete: function() {},
                loadingError: function() {}
            }
        
        };

*/

function MADataTable(options) 
{
    this.options = options;
    this.GenerateHeaders();
    this.GetData();
}

MADataTable.prototype.GenerateHeaders = function()
{
    console.log('Generate Table Headers');
    
    var TableHeadersHTML = '<thead><tr class="slds-line-height_reset">';
    for (var i=0; i < this.options.columns.length; i++)
    {
        var title = "", label = "";
        if(typeof(this.options.columns[i].label) == "function") {
            label = this.options.columns[i].label()
        }
        else {
            title = this.options.columns[i].label;
            label = this.options.columns[i].label;
        }

        TableHeadersHTML += '<th class="slds-is-sortable slds-is-resizable slds-text-title_caps" scope="col"'
                            + ' sortable="' + (this.options.columns[i].sortable) + '"'
                            + ' sortAs="' + (this.options.columns[i].sortAs ? this.options.columns[i].sortAs : 'string') + '"'
                            + ' >'
                                + '<a href="javascript:void(0);" class="slds-th__action slds-text-link_reset" tabindex="0">'
                                    + '<span class="slds-assistive-text">Sort</span>'
                                    + '<span class="slds-truncate" title="' + title + '">'
                                        + label
                                    + '</span>'
                                    + '<span class="slds-icon_container slds-icon-utility-arrowdown" title="Sort">'
                                        + '<svg class="slds-icon slds-icon_x-small slds-icon-text-default slds-is-sortable__icon" aria-hidden="true">'
                                            + '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{!URLFOR($Resource.MALive, \'/assets/icons/utility-sprite/svg/symbols.svg#arrowdown\')}"></use>'
                                        + '</svg>'
                                    + '</span>'
                                    + '<span class="slds-assistive-text" aria-live="assertive" aria-atomic="true"></span>'
                                + '</a>'
                                + '<div class="slds-resizable">'
                                    + '<label for="cell-resize-handle-' + i + '" class="slds-assistive-text">Column width</label>'
                                    + '<input type="range" min="20" max="1000" class="slds-resizable__input slds-assistive-text" id="cell-resize-handle-' + i + '" tabindex="0"/>'
                                    + '<span class="slds-resizable__handle">'
                                        + '<span class="slds-resizable__divider"></span>'
                                    + '</span>'
                                + '</div>'
                            + '</th>';

/*<th class="slds-is-sortable slds-is-resizable slds-text-title_caps" scope="col" sortable="true" sortas="string" style="position: relative; width: 234px;" sort-order="ascending">
<span class="slds-truncate" title="Error Name">Error Name</span>
<div style="" class="slds-resizable">
<label for="cell-resize-handle-33" class="slds-assistive-text">Name column width</label>
<input type="range" min="20" max="1000" class="slds-resizable__input slds-assistive-text" id="cell-resize-handle-33" tabindex="0">
<span class="slds-resizable__handle" onmousedown="calculateWidth();" ondrag="setNewWidth();>
<span class="slds-resizable__divider"></span>
</span>
</div>
</th>*/

    }
    TableHeadersHTML += '</tr></thead>';

    $(this.options.tableSelector).append(TableHeadersHTML);


    //make columns clickable for sorting
    (function (obj) {
        console.log(obj);
        
        $(obj.options.tableSelector).find('th').click(function(){
            
            console.log( $(this).index() );
            console.log( $(this).attr('sortable') );

            var ascending = true;
            var sortAs = 'string';
            
            if ($(this).attr('sort-order') == 'ascending')
            {
                console.log('sort order is ascending');
                ascending = false;
            }
            
            if ($(this).attr('sortas') == 'number')
            {
                sortAs = 'number';
            }
            
            if ($(this).attr('sortable') == 'true')
            {
                console.log('sortable');
            
                
                $( obj.options.tableSelector + ' tr td:nth-child(' + (parseInt($(this).index()) + 1)  +  ')').sortElements(function(a, b){
                    
                    var aValue = $(a).attr('sortable-value');
                    var bValue = $(b).attr('sortable-value');
                    
                    if (sortAs == 'number')
                    {
                        console.log('sort as number');
                        aValue = parseInt(aValue);
                        bValue = parseInt(bValue);
                    }
                    
                    console.log(aValue);
                    console.log(bValue);
                    
                    if (ascending)
                    {
                        return aValue > bValue ? 1 : -1;
                    }
                    else
                    {
                        return aValue > bValue ? -1 : 1;
                    }
                    
                    
                }, function(){
                    
                    // parentNode is the element we want to move
                    return this.parentNode; 
                    
                });
                
                //store order back on record
                $(this).attr('sort-order', (ascending) ? 'ascending' : 'decending');
            }
            
            
        });
        
    })(this);

    (function () {
        var thElm;
        var startOffset;

        Array.prototype.forEach.call(
            document.querySelectorAll("table th"),
            function (th) {
                th.style.position = 'relative';

                // var grip = document.createElement('div');
                var grip = th.getElementsByTagName('div')[0];
                /*grip.innerHTML = "&nbsp;";
                grip.style.top = 0;
                grip.style.right = 0;
                grip.style.bottom = 0;
                grip.style.width = '5px';
                grip.style.position = 'absolute';
                grip.style.cursor = 'col-resize';*/
                grip.addEventListener('mousedown', function (e) {
                    console.log('mousedown event: ' + e)
                    thElm = th;
                    startOffset = th.offsetWidth - e.pageX;
                });
                /*grip.addEventListener('drag', function (e) {
                    console.log('drag event: ' + e)
                    if (thElm) {
                        thElm.style.width = startOffset + e.pageX + 'px';
                    }
                });*/
                // th.appendChild(grip);
            });

        document.addEventListener('mousemove', function (e) {
            console.log('mousemove event: ' + e)
            if (thElm) {
                thElm.style.width = startOffset + e.pageX + 'px';
            }
        });

        document.addEventListener('mouseup', function () {
            thElm = undefined;
        });
    })();
    
};

/*MADataTable.prototype.calculateWidth = function(component, event, helper) {
            var childObj = event.target
            var parObj = childObj.parentNode;
            var count = 1;
            //parent element traversing to get the TH
            while(parObj.tagName != 'TH') {
                parObj = parObj.parentNode;
                count++;
            }
            console.log('final tag Name'+parObj.tagName);
            //to get the position from the left for storing the position from where user started to drag
            var mouseStart=event.clientX; 
            component.set("v.mouseStart",mouseStart);
            component.set("v.oldWidth",parObj.offsetWidth);
    }
     
MADataTable.prototype.setNewWidth = function(component, event, helper) {
            var childObj = event.target
            var parObj = childObj.parentNode;
            var count = 1;
            //parent element traversing to get the TH
            while(parObj.tagName != 'TH') {
                parObj = parObj.parentNode;
                count++;
            }
            var mouseStart = component.get("v.mouseStart");
            var oldWidth = component.get("v.oldWidth");
            //To calculate the new width of the column
            var newWidth = event.clientX- parseFloat(mouseStart)+parseFloat(oldWidth);
            parObj.style.width = newWidth+'px';//assign new width to column
    }*/


MADataTable.prototype.GetObjProperty = function(obj, prop)
{
    prop = prop || '';
    var arr = prop.split(".");
    while(arr.length && (obj = obj[arr.shift()]));
    return obj;
};

MADataTable.prototype.GetData = function()
{
    if (this.GetObjProperty(this.options,'events.loading') != undefined)
    {
        this.options.events.loading();
    }
    
    
    //need closure since this is an ajax call
    (function (obj) {

        // var params = obj.options.remoteFunction.params || {};
        if (obj.GetObjProperty(obj.options,'remoteFunction.params') != undefined) {
            Visualforce.remoting.Manager.invokeAction(
                obj.options.remoteFunction.path,
                obj.options.remoteFunction.params,
                handleResults,
                {escape: false}
            );
        }
        else {
            Visualforce.remoting.Manager.invokeAction(
                obj.options.remoteFunction.path,
                handleResults,
                {escape: false}
            );
        }

        function handleResults(result, event) {

                console.log('>>> event.status: ' + event.status);
                console.log('>>> event.message: ' + event.message);
                console.log('>>> event.type: ' + event.type);
                console.log('>>> event.where: ' + event.where);
                
                
                if (event.status)
                {

                    if (obj.GetObjProperty(obj.options,'events.loadingComplete') != undefined)
                    {
                        obj.options.events.loadingComplete(result);
                    }

                    try {
                        result = JSON.parse(result);
                    }
                    catch(e) {
                        if (obj.GetObjProperty(obj.options,'events.loadingError') != undefined)
                        {
                            if (result.hasOwnProperty('success') && result.success) {
                                // response already correctly parsed. Do nothing
                            }
                            else {
                                obj.options.events.loadingError(result, event);
                            }
                        }
                    }
                    
                    //loop over arrayProperty
                    var TableDataHTML = '<tbody>';
                    
                    for (var index=0; index < result[obj.options.remoteFunction.arrayProperty].length; index++)
                    {
                        TableDataHTML += '<tr class="slds-hint-parent">';
                        
                        //loop over table cols
                        for (var i=0; i < obj.options.columns.length; i++)
                        {
                            
                            console.log(result[obj.options.remoteFunction.arrayProperty][index]);
                            
                            
                            var RulePropertyValue = '';
                            var RulePropertySortValue = '';
                            
                            
                            if (obj.options.columns[i].property)
                            {
                                console.log('has property');
                                
                                RulePropertyValue = obj.GetObjProperty(result[obj.options.remoteFunction.arrayProperty][index], obj.options.columns[i].property);
                                RulePropertySortValue = RulePropertyValue;
                                
                                if (RulePropertyValue == undefined)
                                {
                                    RulePropertyValue = '';
                                    RulePropertySortValue = '';
                                }
                                else
                                {
                                    if (obj.GetObjProperty(obj.options.columns[i],'formatAs') == undefined)
                                    {
                                        //place holder for later
                                    }
                                    
                                    else
                                    {
                                        if (typeof(obj.options.columns[i].formatAs) == "function")
                                        {
                                            RulePropertyValue = obj.options.columns[i].formatAs(result[obj.options.remoteFunction.arrayProperty][index]);
                                        }
                                        else if (obj.options.columns[i].formatAs == 'date')
                                        {
                                            if (isNaN(RulePropertyValue)) {
                                                RulePropertyValue = '';
                                                RulePropertySortValue = '1';
                                            }
                                            else if ((typeof(RulePropertyValue) == "number" && RulePropertyValue.toString().length > 10) || RulePropertyValue.length > 10) {
                                                RulePropertyValue = moment(Number(RulePropertyValue)).format("MM/DD/YYYY h:mm a"); 
                                            }
                                            else {
                                                RulePropertyValue = moment.unix(RulePropertyValue).format("MM/DD/YYYY h:mm a"); 
                                            }
                                        }
                                    }
                                    
                                }
                            }
                            else
                            {
                                console.log('missing property');
                                
                                if (typeof(obj.options.columns[i].formatAs) == "function")
                                {
                                    RulePropertyValue = obj.options.columns[i].formatAs(result[obj.options.remoteFunction.arrayProperty][index]);
                                }
                            }
                            
                            TableDataHTML += '<td role="gridcell" sortable-value="' + RulePropertySortValue + '">';
                            TableDataHTML += '<div';
                            if(!/errors/i.test(obj.options.columns[i].label) && !/actions/i.test(obj.options.columns[i].label) && !/resolved/i.test(obj.options.columns[i].label)) { //truncating the errors messes up the CSS for the badges and dropdowns
                                TableDataHTML += ' class="slds-truncate"';
                            }
                            
                            if(typeof(obj.options.columns[i].label) == "function") { //if the label is a function, do not inject label as title
                                TableDataHTML += '>' + RulePropertyValue + '</div></td>';
                            }
                            else {
                                TableDataHTML += ' title="' + obj.options.columns[i].label + '">' + RulePropertyValue + '</div></td>';
                            }

                        }
                        
                        TableDataHTML += '</tr>';
                    }
                    TableDataHTML += '</tbody>';
                    

                    $(obj.options.tableSelector).append(TableDataHTML);
                    
                    if (obj.options.defaultSortIndex)
                    {
                        $(obj.options.tableSelector + ' tr th:nth-child(' + (obj.options.defaultSortIndex + 1) + ')').trigger( "click" );
                    }

                    if (obj.GetObjProperty(obj.options,'events.tableCreated') != undefined)
                    {
                        obj.options.events.tableCreated();
                    }
                    
                }
                else
                {
                    if (obj.GetObjProperty(obj.options,'events.loadingError') != undefined)
                    {
                        obj.options.events.loadingError(result, event);
                    }
                } //end if (event.status)
                
            } // end function

    })(this);
    
   
};

MADataTable.prototype.RefreshData = function()
{
    $(this.options.tableSelector).find('tbody').html('');
    this.GetData();
};



jQuery.fn.sortElements = (function(){
    
    var sort = [].sort;
    
    return function(comparator, getSortable) {
        
        getSortable = getSortable || function(){return this;};
        
        var placements = this.map(function(){
            
            var sortElement = getSortable.call(this),
                parentNode = sortElement.parentNode,
                
                // Since the element itself will change position, we have
                // to have some way of storing it's original position in
                // the DOM. The easiest way is to have a 'flag' node:
                nextSibling = parentNode.insertBefore(
                    document.createTextNode(''),
                    sortElement.nextSibling
                );
            
            return function() {
                
                if (parentNode === this) {
                    throw new Error(
                        "You can't sort elements if any one is a descendant of another."
                    );
                }
                
                // Insert before flag:
                parentNode.insertBefore(this, nextSibling);
                // Remove flag:
                parentNode.removeChild(nextSibling);
                
            };
            
        });
       
        return sort.call(this, comparator).each(function(i){
            placements[i].call(getSortable.call(this));
        });
        
    };
    
})();
//   emxUISearchNavBar.js
//
//   Copyright (c) 1992-2011 Dassault Systemes.
//   All Rights Reserved.
//   This program contains proprietary and trade secret information of MatrixOne,
//   Inc.  Copyright notice is precautionary only
//   and does not evidence any actual or intended publication of such program
//
//   static const char RCSID[] = $Id: emxUISearchNavBar.js,v 1.2 2014/01/28 22:09:54 bfrederi Exp $
//   ================================================================

//=================================================================
// Part 1: Locate Object Manager
//=================================================================
var objMgr = top.objMgr;

if (!objMgr)
  objMgr = top.opener.top.objMgr;
  
if (!objMgr)
  alert(emxUIConstants.STR_JS_ObjectManagerCNBL);
else { 
//=================================================================
// Part 2: Global Constants
//=================================================================
// This data in this section may be changed in order to customize
// the tab interface.
//=================================================================

//directories

var DIR_SEARCHNAVBAR = "";    
var DIR_STYLES = "";
//Modified by PS for Sogeti for 2012x Upgrade Defect # 7711...starts
//if (isMaxMoz178 || isMinMoz1907) {
if (isMaxMoz178 || isMinMoz1907 || isMaxMoz120) {
//Modified by PS for Sogeti for 2012x Upgrade Defect # 7711...ends
//directories
    DIR_SEARCHNAVBAR = "common/images/";    
    DIR_STYLES = "common/styles/";
} else {
//directories
	//Defect 9653: removed "../" before common dir references to fix style issues in some search dialogs (project Members add member) in IE
    DIR_SEARCHNAVBAR = "common/images/";    
    DIR_STYLES = "common/styles/"; 
	//Defect 9653 END
}

var DIR_IMG_SPACER = DIR_SEARCHNAVBAR + "utilSpacer.gif";

//arrows
var IMG_SEARCH_ARROW = DIR_SEARCHNAVBAR + "utilSearchPlus.gif";
var IMG_SEARCH_ARROW_EXPANDED = DIR_SEARCHNAVBAR + "utilSearchMinus.gif";

//tab images
var IMG_SEARCH_TAB_TOP = DIR_SEARCHNAVBAR + "utilSearchTabTop.gif";
var IMG_SEARCH_TAB_SIDE = DIR_SEARCHNAVBAR + "utilSearchTabSide.gif";
var IMG_SEARCH_TAB_TOPSIDE = DIR_SEARCHNAVBAR + "utilSearchTabTopSide.gif";
var IMG_SEARCH = DIR_SEARCHNAVBAR + "iconSmallSearch.gif";



//the urls for the different framesets
var URL_MAIN = "../common/emxMainFrame.asp";
var URL_SHRUNK = "../common/emxShrunkFrame.asp";

}

//=================================================================
// Part 3: Object Definitions
//=================================================================
// This section defines the objects that control the navbar
// and should not be modified in any way.  Doing so could cause
// the navbar to malfunction.
//=================================================================

//-----------------------------------------------------------------
// Object jsNavBar
// This object encapsulates the navbar object.
//
// Parameters:
//  strStylesheet (String) - the CSS file.
//-----------------------------------------------------------------
function jsNavBar(strName, strStylesheet) {

  //the stylesheet
  this.stylesheet = DIR_STYLES + strStylesheet;
  
  //name of the navbar
  this.name = strName;
  
  //menus
  this.menus = new Array;
  
  //currently open menu, -1 if none
  this.selectedID = -1;
  
  this.selectedMenuId = 0;
  this.selectedMenuItemId = 0;
  
  //the frame to draw the navbar in
  this.displayFrame = "navBarDisplay";
  
  //methods
  this.addMenu = _jsNavBar_addMenu;
  this.draw = _jsNavBar_draw;
  this.refresh = _jsNavBar_refresh;
  this.drawMenu = _jsNavBar_drawMenu;
  this.drawMenuItem = _jsNavBar_drawMenuItem;
}

//-----------------------------------------------------------------
// Method jsNavBar.addMenu()
// This method creates a new menu on the navbar.
//
// Parameters:
//  strTitle (String) - the text to be displayed.
// Returns:
//  The created jsNavBarMenu.
//-----------------------------------------------------------------
function _jsNavBar_addMenu(strTitle) {

  //create the item
  var objMenu = new jsNavBarMenu(strTitle);
  
  //add it to the array
  objMenu.id = this.menus.length;
  this.menus[this.menus.length] = objMenu;
  
  //return the object
  return objMenu;
}

//-----------------------------------------------------------------
// Method jsNavBar.drawMenu()
// This method draws the header for a menu.
//
// Parameters:
//  d (jsDocument) - string buffer to write to.
//  objMenu (jsNavBarMenu) - the menu to draw.
// Returns:
//  nothing.
//-----------------------------------------------------------------


function _jsNavBar_drawMenu(d, objMenu) {
//function drawMenu() {

  //create URL
  var strURL = "javascript:top.clickMenu('" + this.name + "', " + objMenu.id + ")";

  //begin table
  d.write("<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"188\">");
  
  d.write("<tr><td width=\"16\" background=\"");
  
  d.write(IMG_SEARCH_TAB_TOP);
    
  d.write("\"><img src=\"");
  d.write(DIR_IMG_SPACER);
  d.write("\" border=\"0\" alt=\"\" width=\"16\" height=\"9\" /></td><td width=\"16\" background=\"");

  d.write(IMG_SEARCH_TAB_TOP);
    
  d.write("\"><img src=\"");
  d.write(DIR_IMG_SPACER);
  d.write("\" border=\"0\" alt=\"\" width=\"16\" height=\"9\" /></td><td width=\"27\" valign=\"top\"><img src=\"");
  d.write(IMG_SEARCH_TAB_TOPSIDE);

  d.write("\" border=\"0\" alt=\"\" /></td></tr>");
  d.write("<tr><td width=\"16\" valign=\"top\"><a href=\"");
  d.write(strURL);
  d.write("\"><img src=\"");
  d.write(objMenu.expanded ? IMG_SEARCH_ARROW_EXPANDED : IMG_SEARCH_ARROW);
    
  d.write("\" border=\"0\" alt=\"*\" width=\"15\" height=\"15\" /></a></td><td><a class=\"menu\" href=\"");
  d.write(strURL);
  d.write("\"><b>");
  d.write(objMenu.title);
  d.write("</b></a></td><td width=\"27\" valign=\"top\"><img src=\"");
  
  d.write(IMG_SEARCH_TAB_SIDE);
  
  d.write("\" border=\"0\" alt=\"\" /></td></tr></table>");
  d.write("&nbsp;");

}

//-----------------------------------------------------------------
// Method jsNavBar.drawMenuItem()
// This method draws a menu item.
//
// Parameters:
//  d (jsDocument) - string buffer to write to.
//  objMenuItem (jsNavBarMenuItem) - the menu item to draw.
// Returns:
//  nothing.
//-----------------------------------------------------------------
function _jsNavBar_drawMenuItem(d, objMenuItem) {

  //the URL
  var strURL = "javascript:top.clickMenuItem('" + this.name + "', " + objMenuItem.menuID + ", " + objMenuItem.id + ")";
  
  d.write("<tr valign=\"top\">");
  
  d.write("<table cellpadding=\"0\" cellspacing=\"0\" ><tr><td><img src=\"");
  d.write(IMG_SEARCH);
  d.write("\" alt=\"*\" border=\"0\" />&nbsp;</td><td  ");

  if(objMenuItem.isSelected)
    d.write("class=\"selected\"");

  d.write("><a class=\"tab\" href=\"");
  d.write(strURL);
  d.write("\">");
  d.write(objMenuItem.title);
  d.write("</a></td></tr></table>");


  d.write("</tr><tr valign=\"top\"><td align=\"center\" valign=\"top\"><img src=\"");
  d.write(DIR_IMG_SPACER);
  d.write("\" width=\"16\" height=\"8\" alt=\"\" border=\"0\" /></td><td><img src=\"");
  d.write(DIR_IMG_SPACER);
  d.write("\" width=\"4\" height=\"8\" border=\"0\" alt=\"\" /></td></tr>");  


} 

//-----------------------------------------------------------------
// Method jsNavBar.draw()
// This method draws the main view of the navbar.
//
// Parameters:
//  none.
// Returns:
//  nothing.
//-----------------------------------------------------------------
function _jsNavBar_draw() {
  //create string buffer
  var d = new top.jsDocument;
  
  
  //begin HTML header
  d.writeHTMLHeader(this.stylesheet);
  d.writeBody();
  
  //draw each item
  for (var i=0; i < this.menus.length; i++) {
  
    //draw the menu
    this.drawMenu(d, this.menus[i]);
    
    //check for open menu
    if (this.menus[i].expanded) {
    
      //start table
      d.write("<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">");
      
      //draw the menu items
      for (var j=0; j < this.menus[i].items.length; j++)
        this.drawMenuItem(d, this.menus[i].items[j]); 

      
      //provide extra space
      d.write("<tr><td><img src=\"");
      d.write(DIR_IMG_SPACER);
      d.write("\" width=\"5\" height=\"10\" /></td><td></td></tr>");
      //end table
      d.write("</table>");
    }
  
  }
  
  //end the HTML
  d.writeHTMLFooter();
  
  //find the frame to draw to
  var frameDisplay = findFrame(top, this.displayFrame);

  //write to the screen
  with (frameDisplay.document) {
    open();
    write(d);
    close();
  }
}

//-----------------------------------------------------------------
// Method jsNavBar.refresh()
// This method redraws the main view of the navbar.
//
// Parameters:
//  none.
// Returns:
//  nothing.
//-----------------------------------------------------------------
function _jsNavBar_refresh() {

  this.draw();
}

//-----------------------------------------------------------------
// Object jsNavBarMenu
// This object is a menu on the navbar.
//
// Parameters:
//  strTitle (String) - the text to be displayed for this menu.
// Returns:
//  The created jsNavBarMenu.
//-----------------------------------------------------------------
function jsNavBarMenu(strTitle) {

  //text to be displayed
  this.title = strTitle;
  
  //menu items
  this.items = new Array;
  
  //id of this menu
  this.id = -1;
  
  //is this expanded?
  this.expanded = false;
  
  //methods
  this.addItem = _jsNavBarMenu_addItem;
}

//-----------------------------------------------------------------
// Method jsNavBarMenu.addItem()
// This method adds a menu item to the menu.
//
// Parameters:
//  strTitle (String) - the text to be displayed.
//  strURL (String) - the URL to go to.
//  strTarget (String) - the target for the URL. (optional)
// Returns:
//  The created jsNavBarMenuItem.
//-----------------------------------------------------------------
function _jsNavBarMenu_addItem(strTitle, strURL, strTarget) {

  //create the item
  var objMenuItem = new jsNavBarMenuItem(strTitle, strURL, strTarget);
  
  //add it to the array
  objMenuItem.id = this.items.length;
  objMenuItem.menuID = this.id;
  if(this.id == 0 && this.items.length == 0)
    objMenuItem.isSelected = 1;
  this.items[this.items.length] = objMenuItem;
  
      
  //return the object
  return objMenuItem;
}

//-----------------------------------------------------------------
// Object jsNavBarMenuItem
// This object represents a menu item on the navbar.
//
// Parameters:
//  strTitle (String) - the text to be displayed.
//  strURL (String) - the URL to go to.
//  strTarget (String) - the target for the URL. (optional)
//  strWindowFeatures (String) - the features for the popup window.
//----------------------------------------------------------------- 
function jsNavBarMenuItem (strTitle, strURL, strTarget, strWindowFeatures) {
  this.title = strTitle;
  this.url = strURL;
  this.target = strTarget;
  this.isPopup = (strTarget == "popup");
  this.id = -1;
  this.menuID = -1;
  this.isSelected = 0;
  
  //determine popup settings
  if (this.isPopup) {
    //get regular expressions
    var reWidth = /width=(\d*)/gi;
    var reHeight = /height=(\d*)/gi;
    var reScrolling = /scrollbars=yes/gi;
    
    //get the settings
    reWidth.test(strWindowFeatures);
    this.width = parseInt(RegExp.$1,10);
    reHeight.test(strWindowFeatures);
    this.height = parseInt(RegExp.$1,10)
    this.scrolling = reScrolling.test(strWindowFeatures);
  }
}

//=================================================================
// Part 5: Event Handling
//=================================================================
// The code in this handles different events for the navbar. 
//=================================================================

//-----------------------------------------------------------------
// Function clickMenu()
// This functions handles the clicks of the menu.
//
// Parameters:
//  strName (String) - the name of the menu to act on.
//  iMenuID (int) - the ID of the menu item that was clicked.
// Returns:
//  nothing.
//----------------------------------------------------------------- 
function clickMenu(strName, iMenuID) {
  
  //get the navbar
  var navbar = objMgr.getNavBar(strName);

  //if they clicked on the opened menu, close it
  navbar.selectedID = (iMenuID == navbar.selectedID ? -1 : iMenuID);
  
  //toggle expansion
  navbar.menus[iMenuID].expanded = !navbar.menus[iMenuID].expanded;
  
  //refresh view
  navbar.refresh();
}

//-----------------------------------------------------------------
// Function clickMenuItem()
// This functions handles the clicks of the menu.
//
// Parameters:
//  strName (String) - the name of the menu to act on.
//  iMenuID (int) - the ID of the menu that the item belongs to.
//  iMenuItemID (int) - the ID of the menu item that was clicked
// Returns:
//  nothing.
//----------------------------------------------------------------- 
function clickMenuItem(strName, iMenuID, iMenuItemID) {
  
  //get the navbar
  var objNavBar = objMgr.getNavBar(strName);
  //get the menu item
  var objMenuItem = objNavBar.menus[objNavBar.selectedMenuId].items[objNavBar.selectedMenuItemId];
  objMenuItem.isSelected = 0;
  objMenuItem = objNavBar.menus[iMenuID].items[iMenuItemID];
  objMenuItem.isSelected = 1;
  objNavBar.selectedMenuId = iMenuID;
  objNavBar.selectedMenuItemId = iMenuItemID;
  objNavBar.refresh();
  
  //check to see what type of target there is
  if (objMenuItem.isPopup) {
    top.showModalDialog(objMenuItem.url, 600, 600, true);   
    //top.showDialog(objMenuItem.url)
  } else if (objMenuItem.url.indexOf('javascript:') > -1) {
    eval(objMenuItem.url);
  } else {
    //get the frame
    
    var objFrame = findFrame(top,objMenuItem.target);

    //load the URL
    setTimeout(function () {objFrame.document.location.href = objMenuItem.url}, 100);
  }
  
}

//-----------------------------------------------------------------
// Function hideNavBar()
// This functions hides the navbar.
//
// Parameters:
//  None.
// Returns:
//  nothing.
//----------------------------------------------------------------- 
function hideNavBar(bNavBarMulti) {
  //get references to frames
  var frameContent = objMgr.findFrame("content");
  var frameNavBar = objMgr.findFrame("navbar");
  var frameTreeDisplay = objMgr.findFrame("treeDisplay");
  var frameMain = objMgr.findFrame("mainFrame");
  
  //get URls
    var emxcontenturl = frameContent.document.location.href;    
    objMgr.URLs['navbar'] = frameNavBar.document.location.href;

  //is there a tree?
  if (frameTreeDisplay) {
    //build the URL
    emxcontenturl = top.addURLParam(emxcontenturl, "tree=true"); 
  
    //save the tree
    //objMgr.saveTree();
  } else {
    //build the URL
    emxcontenturl = top.addURLParam(emxcontenturl, "tree=false"); 
  
  }
                    
var mainframeurl;

  //build URL for main frame
  if (arguments.length > 0) {
      mainframeurl =  URL_SHRUNK + "?multi=" + (bNavBarMulti ? "yes" : "no");
    objMgr.URLs['content'] = emxcontenturl;
  } else {
    mainframeurl =  URL_SHRUNK + "?navbar=" + objMgr.URLs['navbar'] + "&emxcontenturl="+emxcontenturl;
  }
   frameMain.document.location.href = mainframeurl;
}

//-----------------------------------------------------------------
// Function showNavBar()
// This functions shows the navbar.
//
// Parameters:
//  None.
// Returns:
//  nothing.
//----------------------------------------------------------------- 
function showNavBar(bNavBarMulti) {    
  //get references to frames
  var frameContent = objMgr.findFrame("content");
  var frameNavBar = objMgr.findFrame("navbar");
  var frameTreeDisplay = objMgr.findFrame("treeDisplay");
  var frameMain = objMgr.findFrame("mainFrame");

  //get the content frame URL
    var emxcontenturl = frameContent.document.location.href;
  
  //build content URL 
  emxcontenturl = top.addURLParam(emxcontenturl, (frameTreeDisplay ? "tree=true" : "tree=false"));                  

  var mainframeurl;
  
  //build URL for main frame
  if (arguments.length > 0) {
      mainframeurl =  URL_MAIN + "?multi=" + (bNavBarMulti ? "yes" : "no");
    objMgr.URLs['content'] = emxcontenturl;
  } else {
    mainframeurl =  URL_MAIN + "?navbar="+objMgr.URLs['navbar']+"&emxcontenturl="+emxcontenturl; 
  }
    frameMain.document.location.href = mainframeurl;
}


//-----------------------------------------------------------------
// Function hideTopFrame()
// This functions hides the top frame.
//
// Parameters:
//  None.
// Returns:
//  nothing.
//----------------------------------------------------------------- 
function hideTopFrame(strAppName) {

  topFrameset.rows = "54,*";
  frames[0].document.location.href = "../common/AppHeader.asp?app=" + strAppName + "&shrunk=yes";
}

//-----------------------------------------------------------------
// Function showTopFrame()
// This functions shows the top frame.
//
// Parameters:
//  None.
// Returns:
//  nothing.
//----------------------------------------------------------------- 
function showTopFrame(strAppName) {    
  frames[0].document.location.href = "../common/AppHeader.asp?app=" + strAppName;
  topFrameset.rows = "93,*";
}

//=================================================================
// Part 6: Helper Functions
//=================================================================
// The code in this section handles extra. 
//=================================================================

function showContent(strAltURL) {  
  document.location.href = strAltURL;
}

//-----------------------------------------------------------------
// Function findFrame()
// This method finds a frame with a given name.
//
// Parameters:
//  objWindow (window) - the top window to start searching from.
//  strName (String) - the name of the frame to look for.
// Returns:
//  A pointer to the frame object.
//-----------------------------------------------------------------
function findFrame(objWindow, strName) {

  var objFrame = objWindow.frames[strName];
  if (!objFrame) {
    for (var i=0; i < objWindow.frames.length && !objFrame; i++)
      objFrame = findFrame(objWindow.frames[i], strName);
  }
  
  return objFrame;
}

function trimWhitespace(strString) {
    strString = strString.replace(/^[\s\u3000]*/g, "");
    return strString.replace(/[\s\u3000]+$/g, "");
}


function validateLimit() {
var strQueryLimit = trimWhitespace(document.bottomCommonForm.QueryLimit.value);
//Added code for the Bug No: 329877 6 Begin
var UpperQueryLimit = emxUIConstants.STR_LEGACY_MAX_QUERY_LIMIT;
//Added code for the Bug No: 329877 6 End
if(document.bottomCommonForm.QueryLimit.type == "text")
{
  if (isNaN(strQueryLimit) || strQueryLimit.length == 0)
  {
    alert(emxUIConstants.STR_ALERT_NUMERIC);
    document.bottomCommonForm.QueryLimit.value = 100;
    document.bottomCommonForm.QueryLimit.focus();
  }//Commented code for Bug No: 329877 6 Begin
  //Added code for the Bug No: 329877 6 Begin  
  else if (strQueryLimit > parseInt(UpperQueryLimit))
  {
    alert(emxUIConstants.STR_ALERT_MAXLIMIT);
    document.bottomCommonForm.QueryLimit.value = 100;
    document.bottomCommonForm.QueryLimit.focus();
  }//Added code for the Bug No: 329877 6 End
  else if(strQueryLimit <= 0)
  {
     alert(emxUIConstants.STR_ALERT_NUMBER);
     document.bottomCommonForm.QueryLimit.value = 100;
     document.bottomCommonForm.QueryLimit.focus();
  }
  else if(strQueryLimit.indexOf('.') != -1)
  {
     alert(emxUIConstants.STR_ALERT_NUMERIC);
     document.bottomCommonForm.QueryLimit.value = 100;
     document.bottomCommonForm.QueryLimit.focus();
  }
  else
  {
     this.searchBody.doSearch();
  }
}
else
{
  this.searchBody.doSearch();
}

return;
}

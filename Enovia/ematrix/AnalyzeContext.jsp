<%-- AnalyzeContext.jsp
   Copyright (c) 1992-2002 MatrixOne, Inc.
   All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne,Inc.
   Copyright notice is precautionary only
   and does not evidence any actual or intended publication of such program

   Change History:
   v1.2 - June 2004 - Creation
   v1.3 - June 2004 - Change log file to AnalyzeContext-dd-mm-yyyy.log

--%>


<%@ page import = "matrix.db.*, java.io.*,java.text.*,java.util.*, matrix.util.* ,com.matrixone.servlet.*" %>

<%!
    public static Vector parseContextString(String s, int track_min) throws Exception {
        if(track_min==-1) track_min = 9999999;
        int p0, p1 = 0;
        int total_active_session=0;
        Vector v = new Vector();
        if(s==null) return v;
        for(int i=0 ;i<10000;i++) {
            p0 = s.indexOf("Session ", p1);
            if(s.length()>p1+10) p1 = s.indexOf("Cache size:", p1 + 10);
            else p1 = -1;
            if (p0 == -1 || p1 == -1) break;
            try{
               String sessionStr = s.substring(p0, p1);
               HashMap session_info = parseSessionString(sessionStr, track_min);
               if(session_info!=null){
                 v.add(session_info);
               }
            }catch(Exception e){;}
        }
        return v;
    }
    public String printSession(HashMap session_info){
        return  "SID:" + (String) session_info.get("session")
                  + "| User:" + (String) session_info.get("user")
                  + "| Logged"
                  + "| Last Access DB: " + (String) session_info.get("idle") + " min ago.";
    }

    public StringBuffer printSessions(Vector v){
        StringBuffer sb = new StringBuffer();
        for(int i=0;i<v.size();i++){
          HashMap map = (HashMap) v.get(i);
          sb.append("[" + (i+1) + "] " + printSession(map));
        }
        return sb;
    }

    public StringBuffer printSessions2HTML(Vector v){
          return printSessions2HTML(v,false);
    }

    public StringBuffer printSessions2HTML(Vector v, boolean unique){
        StringBuffer sb = new StringBuffer();
        if(v==null || v.size()==0) return sb;

        sb.append("<table border=0 bgcolor=cdcdcd cellspacing=2 cellpadding=1>");
        sb.append("<tr bgcolor=efefef><td>No."
                  + "</td><td>Session ID"
                  + "</td><td>User ID"
                  + "</td><td>Status"
                  + "</td><td>Last Access DB<br>(minutes ago)</td></tr>");
        for(int i=0;i<v.size();i++){
          HashMap session_info = (HashMap) v.get(i);
          String sessStr =  (String)session_info.get("session");
          if(unique) sessStr = (String)session_info.get("rootSession");

          sb.append("<tr bgcolor=ffffff><td>" + (i+1) + ""
                  + "</td><td>" + sessStr
                  + "</td><td>" + (String) session_info.get("user")
                  + "</td><td> Logged In"
                  + "</td><td>" + (String) session_info.get("idle") + "</td></tr>");
        }
        sb.append("</table>");
        return sb;
    }

    public static Vector getUniqueUsers(Vector v) throws Exception {
        HashMap v_users = new HashMap();
        Vector v_sess = new Vector();
        if(v==null || v.size()==0) return v_sess;
        for(int i=0;i<v.size();i++){
             HashMap map = (HashMap) v.get(i);
             String user = (String) map.get("user");
             //user = user.replace('\n',' ').trim();
             if(!v_users.containsKey(user)){
                v_sess.add(map);
                v_users.put(user,"True");
             }
        }
        return v_sess;
    }

    public static Vector getUniqueSessions(Vector v) throws Exception {
        Vector v_roots = new Vector();
        Vector v_sess = new Vector();
        if(v==null || v.size()==0) return v_sess;
        for(int i=0;i<v.size();i++){
             HashMap map = (HashMap) v.get(i);
             String root = (String) map.get("rootSession");
             root = root.replace('\r',' ').trim();
             root = root.replace('\n',' ').trim();
             if(!v_roots.contains((String)root.trim())){
                   v_roots.add((String)root.trim());
                   v_sess.add(map);
             }
        }
        return v_sess;
    }

    public static HashMap parseSessionString(String s, int track_min) throws Exception {
//Session F7713DDDE695B5CFEE2F3ECE1368633D User: 'Nagaraj Lanka' logged in Vault: 'Chelmsford' Last:
//t@35, listAll.bosLattice Idle: 3 minutes 34 seconds 0 active sessions
        if(s==null) return null;
        int p_user0 = s.indexOf("User:");
        int p_user1 = s.indexOf("logged in");
        int p_idle = s.indexOf("Idle: ");
        int p_sec = s.indexOf("second");
        //return p_user0 + " " + p_user1 + " " + p_idle + " " + p_sec;
        if(p_user0<5 || p_user1==-1 || p_sec==-1) return null;
        String sessionStr = s.substring(8, p_user0-5);
        String rootSession = sessionStr;
        if(sessionStr!=null && sessionStr.indexOf(":mx")>0) rootSession = sessionStr.substring(0,sessionStr.indexOf(":mx"));
        String user = s.substring(p_user0 + 9, p_user1 - 2);
        String idle = s.substring(p_idle + 5, p_sec+7);
        int idleMinutes = idleMinutes(idle);
        if(isActive(idle,track_min)){
          HashMap map = new HashMap();
          map.put("session",sessionStr);
          map.put("rootSession",rootSession);
          map.put("user",user);
          map.put("idle","" + idleMinutes);
          return map;
          //return session + "|" + user + "|" + idle + " active ";
        }
        return null;
    }

    public static int idleMinutes(String s){
     //|Idle: 1 hour 39 minutes 10
        if(s==null) return -1;
        int p_day = s.indexOf(" day");
        int p_hr = s.indexOf(" hour");
        int p_min = s.indexOf(" minute");
        //int p_sec = s.indexOf(" second");
        if(p_hr==-1 && p_min==-1) return 0;
        else{
          int day=0 ;
          int hr = 0;
          int min = 0;
          //int sec = 0;
            if(p_day>0)  day = Integer.parseInt(s.substring(s.indexOf(" ",p_day-4),p_day).trim());
            if(p_hr>0)  hr = Integer.parseInt(s.substring(s.indexOf(" ",p_hr-4),p_hr).trim());
            if(p_min>0) min = Integer.parseInt(s.substring(s.indexOf(" ",p_min-4),p_min).trim());
            //if(p_sec>0) sec = Integer.parseInt(s.substring(s.indexOf(" ",p_sec-4),p_sec).trim());
            return day*24*60+hr*60+min;
        }
    }

    public static boolean isActive(String s, int track_min){
       int idle_min = idleMinutes(s);
       if(idle_min>=0 && idle_min<=track_min) return true;
       else return false;
    }


  public static String executeMQL(Context context,String mql)
  throws Exception{
     String results = "";
     MQLCommand mqlCommand = new MQLCommand();
     try{
         mqlCommand.open(context);
         if (mqlCommand.executeCommand(context, mql))
         {
           results = mqlCommand.getResult();
           mqlCommand.close(context);
         }else{
           throw new Exception(mqlCommand.getError());
         }
         return results;
     }catch(Exception e){
         throw e;
     }
  }

  public static String connectRMI(String user, String password, String port){
       Context context = null;
       try{
           context = new Context(":bos", "//localhost:" + port);
           context.setProtocol("");
           context.setUser(user);
           context.setPassword(password);
           //context.setVault("Chelmsford");
           context.connect();
           String results =  executeMQL(context,"monitor context");
           return results;
       }catch(Exception e){
           return null;
       }finally{
         try{
           context.closeContext();
           context.shutdown();
         }catch(Exception ex){}
       }
  }
%>

<%

out.println("<center><h2>MatrixOne Web User Context Tracking*</h2>");

String pageName = request.getRequestURI();
if (request.getQueryString() != null) {
   pageName += "?" + request.getQueryString();
}

out.println("<meta http-equiv=Refresh content=\"300\";url=\"" + pageName + "\">");

try{
    String type = request.getParameter("stype");
    if(type!=null && !"".equals(type)){
       session.setAttribute("_type", type);
    }else{
      type = (String) session.getAttribute("_type");
    }

    boolean connected = false;
    boolean gateway = false;
    matrix.db.Context context = null;
    int track_min = 60;

    String mode = request.getParameter("mode");
    String smin = request.getParameter("track_min");
    if(smin==null) smin =  (String) session.getAttribute("track_min");

    if(smin!=null && !"".equals(smin)){
       track_min = Integer.parseInt(smin);
       session.setAttribute("track_min", smin);
    }

    Vector v = new Vector();
    Vector v_users = new Vector();
    Vector v_sessions = new Vector();

    String user=null;
    String ports=null;
    String password = null;

    if(!"gateway".equals(type)){
          if (Framework.isLoggedIn(request)){
              context = Framework.getContext(session);
             if (context != null) user = context.getUser();

             String results = executeMQL(context,"monitor context");
             connected = true;
             Vector v1 = parseContextString(results,track_min);
             Vector v_users1 = getUniqueUsers(v1);
             Vector v_sessions1 = getUniqueSessions(v1);
             v.addAll(v1);
             v_users.addAll(v_users1);
             v_sessions.addAll(v_sessions1);
             if("debug".equals(mode)){
                out.println("<p>Logged Single RMI Session (RIP Mode)</b>");
                out.println("<div align=left><pre>" + results + "</pre></div>");
             }
          }else connected=false;

    }else{
        user = request.getParameter("login_name");
        password = request.getParameter("login_password");
        ports = request.getParameter("ports");

        if(user!=null && !"".equals(user)) {
           session.setAttribute("_user", user);
        }else{
           user = (String)session.getAttribute("_user");
        }

        if(password!=null && !"".equals(password)) {
           session.setAttribute("_password", password);
        }else{
           password = (String)session.getAttribute("_password");
        }

        if(ports!=null && !"".equals(ports)) {
           session.setAttribute("_ports", ports);
        }else{
           ports = (String)session.getAttribute("_ports");
        }
        gateway = true;
    }

    if("logout".equals(mode)) {
       try{
          if(session!=null)
            session.invalidate();
          if(!gateway){
            if(Framework.isLoggedIn(request)){;
               context = Framework.getContext(session);
               context.closeContext();
               context = null;
            }
          }
       }catch(Exception ex){;}finally{
          response.sendRedirect("AnalyzeContext.jsp");
       }
    }

    if("gc".equals(mode)) {
       try{
          System.gc();
       }catch(Exception ex){
          out.println(ex.toString());
       }finally{
          response.sendRedirect("AnalyzeContext.jsp");
       }
    }

    if(user != null && gateway){

            if(ports==null || "".equals(ports))
                     ports="1099,1100,1101,1102,1103,1103";

            StringTokenizer st = new StringTokenizer(ports,",;");
            out.println("<br>Your RMI Instances at port:");

            while(st.hasMoreTokens()){
               String tok = st.nextToken();
               if(tok==null || "".equals(tok)) continue;
               //out.println("Checking RMI Gateway Instance: ");
               String results = connectRMI(user,password,tok);
               if(results==null) {
                 out.println("<font color=cdcdcd>" + tok + "<small>(failed)</small></font> ");
                 continue;
               }
               connected = true;
               Vector v1 = parseContextString(results,track_min);
               Vector v_users1 = getUniqueUsers(v1);
               Vector v_sessions1 = getUniqueSessions(v1);
               out.println("<font color=green>" + tok + "<small>(TS:" + v1.size() + " US:" + v_sessions1.size() + " UU:"+v_users1.size() + ")</small></font> ");

               v.addAll(v1);
               v_users.addAll(v_users1);
               v_sessions.addAll(v_sessions1);
               if("debug".equals(mode)){
                 out.println("<p>Logged Context Sessions from RMI Instance at PORT:" + tok + "</b>");
                 out.println("<div align=left><pre>" + results + "</pre></div>");
               }
            }
          // combine all unique users..
          if(connected){
             v_users = getUniqueUsers(v);
             v_sessions = getUniqueSessions(v);
          }

    }

    if(user!=null && !connected) out.println("<p><font color=red>User '" + user + "' is not valid.</font><br>");

    if(connected){
            out.println("<p>Welcome <b>" + user + "!</b> &nbsp;&nbsp;&nbsp;&nbsp;<small>Current time:" + new Date() + "&nbsp;&nbsp;&nbsp;&nbsp; <a href=AnalyzeContext.jsp?mode=logout>logout</a> </small>" );

            out.println("<center>");
            out.println("<hr>Total Active Sessions: <a href=AnalyzeContext.jsp>" + v.size() +"</a>");
            out.println("&nbsp;&nbsp; Unique Sessions*: <a href=AnalyzeContext.jsp?mode=usess>" + v_sessions.size() + "</a>");
            out.println("&nbsp;&nbsp; Unique Users*: <a href=AnalyzeContext.jsp?mode=users>" + v_users.size() + "</a> &nbsp;&nbsp;&nbsp;");


            if("users".equals(mode)){
               out.println("<p><b> Total Unique Users in " + (track_min==-1? " <b>all</b> " : String.valueOf(track_min) )
                +  " minutes Interval * </b>");
               out.println(printSessions2HTML(v_users));
            }else if("usess".equals(mode)){
              out.println("<p><b> Total Unique Sessions in " + track_min +  "-minute Interval * </b>");
               out.println(printSessions2HTML(v_sessions,true));
            }else{
              out.println("<p><b> Total Sessions in " + track_min +  "-minute Interval * </b>");
              out.println(printSessions2HTML(v));
            }
            out.println("</center>");

            try {

                Calendar rightNow = Calendar.getInstance();
                int year = rightNow.get(Calendar.YEAR);
                int day = rightNow.get(Calendar.DAY_OF_MONTH);
                int month = rightNow.get(Calendar.MONTH) + 1;

                String logfile = "AnalyzeContext-" + day + "_" + month + "_" + year + ".log";


                BufferedWriter logWriter = new BufferedWriter(new FileWriter(logfile, true));
                logWriter.write("\n Now:" + (new Date()) + " Total Sessions:" + v.size() + " Unique Sessions:" + v_sessions.size() + " Total Users:" + v_users.size());
                for (int i = 0; i < v_sessions.size(); i++) {
                    HashMap map = (HashMap) v_sessions.get(i);
                    logWriter.write("\n" + (new SimpleDateFormat("yy-MM-dd HH:mm:ss")).format(new java.util.Date()));
                    logWriter.write("|" + (String) map.get("user"));
                    logWriter.write("|" + (String) map.get("rootSession"));
                    logWriter.write("|" + (String) map.get("idle"));
                }
                logWriter.close();
            } catch (Exception e) {
                out.println("Error" + e.toString());
            }

            out.println("<div align=left>Notes:<small><br>[*] - The above sessions are reflected the \"logged\" contexts in the MatrixOne's Collaboration Kernel where this context monitoring page is hosted. The context is a memory foot-print of a logged session built in MatrixOne Kernel. Since a logged session may be currently idle, the tracking interval gives you the ability to track which/when sessions were last \"seen\" accessing MatrixOne databases in the past interval time.");
            out.println("<br>[!] - A unique session reflects a web application user instance, typically opening a new browser will create a new unique session. A user account may open many unique sessions (browsers). A unique user is a unique user account, many people could login from different machine using one user account.");
   }else{%>

<SCRIPT LANGUAGE="JavaScript">

  function doIt(form){
    if(document.loginForm.stype[0].checked) {
        document.loginForm.action=document.loginForm.loginServlet.value;
        document.loginForm.submit();
    }else if(document.loginForm.stype[1].checked) {
        document.loginForm.action="AnalyzeContext.jsp";
        document.loginForm.submit();
    }else{
       alert("Choose a server type, is it a RMI RIP, or RMI Gateway?");
       //location.href="<%=pageName%>";
       return false;
    }
  }

</SCRIPT>

<%
 Framework.setTargetPage(session, pageName);
%>

<form name=loginForm method="post">
          <table BORDER="0" width=400>
            <tr>
              <td colspan=2 bgcolor="#cdcdcd"><b>Please login as a system user here:</b></td>
            </tr>
            <tr>
              <td width=100 align=right><br><b>Username</b></td>
              <td width=150 align=left><br><input type="text" name="login_name" value=""
              size="20" maxlength="40"></td>
            </tr>
            <tr valign=top>
              <td width=100 align=right><b>Password</b></td>
              <td width=100% align=left><input type="password" name="login_password" size="20" maxlength="40">
              <input type="submit"  onClick="javascript:doIt(this);" value="Login">
              </td>
            </tr>

            <tr>
              <td colspan=2 bgcolor="#cdcdcd"><b>For Matrix RMI Server Configuration Type:</b></td>
            </tr>

            <tr>
              <td width=100 align=right><input type=radio name=stype value="rip" ></td>
              <td width=100% align=left>RMI RIP Mode
              <br>Login Servlet:<input type="text" name="loginServlet" size="20" maxlength="60" value="servlet/login">
              </td>
            </tr>
            <tr valign=top>
              <td width=100 align=right><input type=radio name=stype value="gateway"></td>
              <td width=100% align=left>Multiple RMI instances using Matrix RMI Gateway<br>RMI Daemon Ports:<input type="text" name="ports" size="60" maxlength="40" value="1099;1100;1101;1102;1103;1104"></td>
            </tr>
          </table>
        </form>

<%
        }
    }catch(Exception e){
         //e.printStackTrace();
         out.println("<hr><br>The session is in a valid state. Please <font color=red>refresh the page first</font>, if still does not work, then close a new browser.</b><p>" + e.toString());

    }

%>

</body>
</html>

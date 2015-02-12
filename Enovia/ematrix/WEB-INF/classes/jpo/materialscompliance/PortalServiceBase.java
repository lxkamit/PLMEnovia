package jpo.materialscompliance;
import matrix.db.*;
import javax.servlet.http.*;
import java.lang.reflect.*;
import org.apache.axis.MessageContext;
import org.apache.axis.transport.http.*;
import matrix.util.WebServiceFacade;
public class PortalServiceBase extends WebServiceFacade
{

  public PortalServiceBase() throws Throwable
  {
    this(null);
  }

  public void unbind() {
    _unbind();
  }

  public PortalServiceBase(Context CONTEXT, Object OBJECT) throws Throwable
  {
    super("PortalServiceBase",CONTEXT,OBJECT);
  }

  public PortalServiceBase(MessageContext mc) throws Throwable
  {
    super("PortalServiceBase",mc,"jpo.materialscompliance.PortalServiceBase");
  }

  public String Login() throws Throwable
  {
    if (checkDebug()) {
      debug("Method: Login - begin");
      debug("Method: Login - end");
    }
    JPOSupport.registerThread(CONTEXT);
    try {
      Class[] TYPES = new Class[0];
      Object[] ARGS = new Object[0];
      Method METHOD = OBJECT.getClass().getMethod("Login",TYPES);
      return (String)METHOD.invoke(OBJECT,ARGS);
    }
    catch (InvocationTargetException EXCEPTION) {
      throw EXCEPTION.getTargetException();
    }
    finally {
      JPOSupport.unregisterThread();
    }
  }

  public String GetMaterialDeclarations(String arg0) throws Throwable
  {
    if (checkDebug()) {
      debug("Method: GetMaterialDeclarations - begin");
      debug("	arg0 :" + arg0);
      debug("Method: GetMaterialDeclarations - end");
    }
    JPOSupport.registerThread(CONTEXT);
    try {
      Class[] TYPES = new Class[1];
      TYPES[0] = String.class;
      Object[] ARGS = new Object[1];
      ARGS[0] = arg0;
      Method METHOD = OBJECT.getClass().getMethod("GetMaterialDeclarations",TYPES);
      return (String)METHOD.invoke(OBJECT,ARGS);
    }
    catch (InvocationTargetException EXCEPTION) {
      throw EXCEPTION.getTargetException();
    }
    finally {
      JPOSupport.unregisterThread();
    }
  }

  public String GetReportedPartTree(String arg0) throws Throwable
  {
    if (checkDebug()) {
      debug("Method: GetReportedPartTree - begin");
      debug("	arg0 :" + arg0);
      debug("Method: GetReportedPartTree - end");
    }
    JPOSupport.registerThread(CONTEXT);
    try {
      Class[] TYPES = new Class[1];
      TYPES[0] = String.class;
      Object[] ARGS = new Object[1];
      ARGS[0] = arg0;
      Method METHOD = OBJECT.getClass().getMethod("GetReportedPartTree",TYPES);
      return (String)METHOD.invoke(OBJECT,ARGS);
    }
    catch (InvocationTargetException EXCEPTION) {
      throw EXCEPTION.getTargetException();
    }
    finally {
      JPOSupport.unregisterThread();
    }
  }

  public void DismissImportJobs(java.util.List arg0) throws Throwable
  {
    if (checkDebug()) {
      debug("Method: DismissImportJobs - begin");
      debug("	arg0 :" + arg0);
      debug("Method: DismissImportJobs - end");
    }
    JPOSupport.registerThread(CONTEXT);
    try {
      Class[] TYPES = new Class[1];
      TYPES[0] = java.util.List.class;
      Object[] ARGS = new Object[1];
      ARGS[0] = arg0;
      Method METHOD = OBJECT.getClass().getMethod("DismissImportJobs",TYPES);
      METHOD.invoke(OBJECT,ARGS);
    }
    catch (InvocationTargetException EXCEPTION) {
      throw EXCEPTION.getTargetException();
    }
    finally {
      JPOSupport.unregisterThread();
    }
  }

  public String GetSubmissions() throws Throwable
  {
    if (checkDebug()) {
      debug("Method: GetSubmissions - begin");
      debug("Method: GetSubmissions - end");
    }
    JPOSupport.registerThread(CONTEXT);
    try {
      Class[] TYPES = new Class[0];
      Object[] ARGS = new Object[0];
      Method METHOD = OBJECT.getClass().getMethod("GetSubmissions",TYPES);
      return (String)METHOD.invoke(OBJECT,ARGS);
    }
    catch (InvocationTargetException EXCEPTION) {
      throw EXCEPTION.getTargetException();
    }
    finally {
      JPOSupport.unregisterThread();
    }
  }

  public String SubmitImportFile(String arg0) throws Throwable
  {
    if (checkDebug()) {
      debug("Method: SubmitImportFile - begin");
      debug("	arg0 :" + arg0);
      debug("Method: SubmitImportFile - end");
    }
    JPOSupport.registerThread(CONTEXT);
    try {
      Class[] TYPES = new Class[1];
      TYPES[0] = String.class;
      Object[] ARGS = new Object[1];
      ARGS[0] = arg0;
      Method METHOD = OBJECT.getClass().getMethod("SubmitImportFile",TYPES);
      return (String)METHOD.invoke(OBJECT,ARGS);
    }
    catch (InvocationTargetException EXCEPTION) {
      throw EXCEPTION.getTargetException();
    }
    finally {
      JPOSupport.unregisterThread();
    }
  }

  public String getStandardMaterial() throws Throwable
  {
    if (checkDebug()) {
      debug("Method: getStandardMaterial - begin");
      debug("Method: getStandardMaterial - end");
    }
    JPOSupport.registerThread(CONTEXT);
    try {
      Class[] TYPES = new Class[0];
      Object[] ARGS = new Object[0];
      Method METHOD = OBJECT.getClass().getMethod("getStandardMaterial",TYPES);
      return (String)METHOD.invoke(OBJECT,ARGS);
    }
    catch (InvocationTargetException EXCEPTION) {
      throw EXCEPTION.getTargetException();
    }
    finally {
      JPOSupport.unregisterThread();
    }
  }

  public String setRoundOffValue(String arg0) throws Throwable
  {
    if (checkDebug()) {
      debug("Method: setRoundOffValue - begin");
      debug("	arg0 :" + arg0);
      debug("Method: setRoundOffValue - end");
    }
    JPOSupport.registerThread(CONTEXT);
    try {
      Class[] TYPES = new Class[1];
      TYPES[0] = String.class;
      Object[] ARGS = new Object[1];
      ARGS[0] = arg0;
      Method METHOD = OBJECT.getClass().getMethod("setRoundOffValue",TYPES);
      return (String)METHOD.invoke(OBJECT,ARGS);
    }
    catch (InvocationTargetException EXCEPTION) {
      throw EXCEPTION.getTargetException();
    }
    finally {
      JPOSupport.unregisterThread();
    }
  }
}

#!/bin/bash
# This script attempts to find an existing installation of Java that meets a minimum version
# requirement on a Linux machine.  If it is successful, it will export a JAVA_HOME environment
# variable that can be used by another calling script.
#
# To specify the required version, set the REQUIRED_VERSION to the major version required, 
# e.g. 1.3, but not 1.3.1.
REQUIRED_VERSION=1.6

# Transform the required version string into a number that can be used in comparisons
REQUIRED_VERSION=`echo $REQUIRED_VERSION | sed -e 's;\.;0;g'`
# Check JAVA_HOME directory to see if Java version is adequate

			distib_Path="/opt/qa_distrib/Enovia/ematrix/WEB-INF/lib"
			Java6_Path="/opt/java/jdk1.6.0_32/bin"
			web_inf_path="/opt/qa_distrib/Enovia/ematrix/WEB-INF"
			ootb_jar_path="/opt/JARS/OOTB_JARs/lib"
            # RQ 19601 START
			cvs_jar_path="/opt/qa_distrib/Enovia/ematrix/WEB-INF/lib"
            # RQ 19601 END
# defect 9621 - Start
export JAVA_HOME=/opt/java/jdk1.6.0_32
export PATH=$JAVA_HOME/bin:$PATH
export CLASSPATH=$CLASSPATH:$JAVA_HOME/lib
# defect 9621 - End
PATH=$PATH:/opt/ANT/apache-ant-1.8.4/bin
export PATH	
ant build -DJDK6.javac.path=$Java6_Path -Ddistib.lib.dir=$distib_Path -Dweb_inf.path=$web_inf_path -Dootb_jar.path=$ootb_jar_path -Dcvs_jar.path=$cvs_jar_path

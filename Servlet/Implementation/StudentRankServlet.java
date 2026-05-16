import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class StudentRankServlet extends HttpServlet {
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        
        try {
            // Get form parameters
            String studentName = request.getParameter("name");
            String marksStr = request.getParameter("marks");
            String subject = request.getParameter("subject");
            
            // Validate input
            if (studentName == null || studentName.isEmpty() ||
                marksStr == null || marksStr.isEmpty() ||
                subject == null || subject.isEmpty()) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "All fields are required");
                return;
            }
            
            int marks = Integer.parseInt(marksStr);
            
            // Validate marks range
            if (marks < 0 || marks > 100) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Marks must be between 0 and 100");
                return;
            }
            
            // Calculate rank based on marks
            String rank = getRank(marks);
            String grade = getGrade(marks);
            
            // Generate HTML response
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Student Rank Result</title>");
            out.println("<style>");
            out.println("body { font-family: Arial, sans-serif; padding: 20px; }");
            out.println(".container { max-width: 600px; margin: 0 auto; padding: 20px; }");
            out.println("h1 { text-align: center; }");
            out.println(".result-item { margin: 15px 0; padding: 10px; }");
            out.println(".label { font-weight: bold; }");
            out.println("button { padding: 10px 20px; cursor: pointer; }");
            out.println("</style>");
            out.println("</head>");
            out.println("<body>");
            out.println("<div class='container'>");
            out.println("<h1>Student Rank Result</h1>");
            out.println("<div class='result-item'>");
            out.println("<span class='label'>Student Name:</span> <span class='value'>" + escapeHtml(studentName) + "</span>");
            out.println("</div>");
            out.println("<div class='result-item'>");
            out.println("<span class='label'>Subject:</span> <span class='value'>" + escapeHtml(subject) + "</span>");
            out.println("</div>");
            out.println("<div class='result-item'>");
            out.println("<span class='label'>Marks:</span> <span class='value'>" + marks + "/100</span>");
            out.println("</div>");
            out.println("<div class='result-item'>");
            out.println("<span class='label'>Grade:</span> <span class='value'>" + grade + "</span>");
            out.println("</div>");
            out.println("<div class='result-item'>");
            out.println("<span class='label'>Rank:</span> <span class='value'>" + rank + "</span>");
            out.println("</div>");
            out.println("<button onclick='window.location.href=\"index.html\"'>Back to Form</button>");
            out.println("</div>");
            out.println("</body>");
            out.println("</html>");
            
        } catch (NumberFormatException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid marks value. Please enter a number.");
        } finally {
            out.close();
        }
    }
    
    // Method to calculate rank based on marks
    private String getRank(int marks) {
        if (marks >= 90) {
            return "Excellent";
        } else if (marks >= 80) {
            return "Good";
        } else if (marks >= 70) {
            return "Average";
        } else {
            return "Needs Improvement";
        }
    }
    
    // Method to get grade based on marks
    private String getGrade(int marks) {
        if (marks >= 90) {
            return "A+";
        } else if (marks >= 80) {
            return "A";
        } else if (marks >= 70) {
            return "B";
        } else if (marks >= 60) {
            return "C";
        } else {
            return "F";
        }
    }
    
    // Helper method to escape HTML characters
    private String escapeHtml(String text) {
        return text.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;")
                   .replace("\"", "&quot;")
                   .replace("'", "&#39;");
    }
}

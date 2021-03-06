using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace yanbal.claimsbook.web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>()
                    .ConfigureLogging(
                        builder =>
                        {
                            // Providing an instrumentation key here is required if you're using
                            // standalone package Microsoft.Extensions.Logging.ApplicationInsights
                            // or if you want to capture logs from early in the application startup
                            // pipeline from Startup.cs or Program.cs itself.
                            builder.AddApplicationInsights("3d0dbaa0-b25c-49f6-827e-962ed5c6a000");

                            // Optional: Apply filters to control what logs are sent to Application Insights.
                            // The following configures LogLevel Information or above to be sent to
                            // Application Insights for all categories.
                            builder.AddFilter<Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider>("", LogLevel.Information);
                        }
                    );
                });
    }
}

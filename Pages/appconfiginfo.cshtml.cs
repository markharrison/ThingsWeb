using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;

namespace ThingsWeb.Pages
{
    public class AppConfigInfoModel : PageModel
    {
        IConfiguration _config;
        AppConfig _appconfig;
        public string strHtml;

        public AppConfigInfoModel(IConfiguration config, AppConfig appconfig)
        {
            _config = config;
            _appconfig = appconfig;
            strHtml = "";
        }

        public void OnGet()
        {
            string EchoData(string key, string value)
            {
                return key + ": <span style='color: blue'>" + value + "</span><br/>";
            }

            strHtml += EchoData("OS Description", System.Runtime.InteropServices.RuntimeInformation.OSDescription);
            strHtml += EchoData("Framework Description", System.Runtime.InteropServices.RuntimeInformation.FrameworkDescription);
            strHtml += EchoData("BuildIdentifier", _config.GetValue<string>("BuildIdentifier"));

            if (_appconfig.AdminPW == HttpContext.Request.Query["pw"].ToString())
            {
                strHtml += "ASPNETCORE_ENVIRONMENT: " + _config.GetValue<string>("ASPNETCORE_ENVIRONMENT") + "<br/>";
                strHtml += "ApplicationInsights ConnectionString: " + _config.GetValue<string>("ApplicationInsights:ConnectionString") + "<br/>";
                strHtml += "MapSKeyAzure: " + _appconfig.MapSKeyAzure + "<br/>";
                strHtml += "MapSKeyBing: " + _appconfig.MapSKeyBing + "<br/>";
                strHtml += "MapSKey: " + _appconfig.MapSKey + "<br/>";
                strHtml += "MapSource: " + _appconfig.MapSource + "<br/>";
                strHtml += "MapStartLong: " + _appconfig.MapStartLong + "<br/>";
                strHtml += "MapStartLat: " + _appconfig.MapStartLat + "<br/>";
                strHtml += "MapStartZoom: " + _appconfig.MapStartZoom + "<br/>";
            }

        }
    }
}

 
 

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
            strHtml += EchoData("BuildIdentifier", _config.GetValue<string>("BuildIdentifier") ?? "");

            if (_appconfig.AdminPW == HttpContext.Request.Query["pw"].ToString())
            {
                strHtml += EchoData("ASPNETCORE_ENVIRONMENT", _config.GetValue<string>("ASPNETCORE_ENVIRONMENT") ?? "");
                strHtml += EchoData("APPLICATIONINSIGHTS_CONNECTION_STRING", _config.GetValue<string>("APPLICATIONINSIGHTS_CONNECTION_STRING") ?? "");
                strHtml += EchoData("ThingsAPIUrl", _appconfig.ThingsAPIUrl);
                strHtml += EchoData("MapSKeyAzure", _appconfig.MapSKeyAzure);
                strHtml += EchoData("MapSKeyBing", _appconfig.MapSKeyBing);
                strHtml += EchoData("MapSKey", _appconfig.MapSKey);
                strHtml += EchoData("MapSource", _appconfig.MapSource);
                strHtml += EchoData("MapStartLong", _appconfig.MapStartLong.ToString());
                strHtml += EchoData("MapStartLat", _appconfig.MapStartLat.ToString());
                strHtml += EchoData("MapStartZoom", _appconfig.MapStartZoom.ToString());
            }

        }
    }
}

 
 

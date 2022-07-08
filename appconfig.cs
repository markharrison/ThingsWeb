using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace ThingsWeb
{
    public class AppConfig
    {
        private string _ThingsAPIUrl;
        private string _MapSKey;
        private string _MapSKeyAzure;
        private string _MapSKeyBing;
        private string _MapSource;
        private double _MapStartLong;
        private double _MapStartLat;
        private double _MapStartZoom;
        private string _AdminPWVal;
        public AppConfig(IConfiguration _config)
        {
            _ThingsAPIUrl = _config.GetValue<string>("ThingsAPIUrl");
            if (!_ThingsAPIUrl.EndsWith("/"))
            {
                _ThingsAPIUrl += "/";
            }

            _MapSKey = _config.GetValue<string>("MapSKey");
            _MapSKeyBing = _config.GetValue<string>("MapSKeyBing");
            _MapSKeyAzure = _config.GetValue<string>("MapSKeyAzure");
            _MapSource = _config.GetValue<string>("MapSource");
            _MapStartLong = _config.GetValue<double>("MapStartLong");
            _MapStartLat = _config.GetValue<double>("MapStartLat");
            _MapStartZoom = _config.GetValue<double>("MapStartZoom");
            _AdminPWVal = _config.GetValue<string>("AdminPW");
        }

        public string ThingsAPIUrl
        {
            get => this._ThingsAPIUrl;
            set
            {
                this._ThingsAPIUrl = value;
                if (!_ThingsAPIUrl.EndsWith("/"))
                {
                    _ThingsAPIUrl += "/";
                }
            }
        }

        public string MapSKey
        {
            get => this._MapSKey;
            set => this._MapSKey = value;
        }

        public string MapSKeyBing
        {
            get => this._MapSKeyBing;
            set => this._MapSKeyBing = value;
        }

        public string MapSKeyAzure
        {
            get => this._MapSKeyAzure;
            set => this._MapSKeyAzure = value;
        }

        public string MapSource
        {
            get => this._MapSource;
            set => this._MapSource = value;
        }
        public double MapStartLong
        {
            get => this._MapStartLong;
            set => this._MapStartLong = value;
        }
        public double MapStartLat
        {
            get => this._MapStartLat;
            set => this._MapStartLat = value;
        }
        public double MapStartZoom
        {
            get => this._MapStartZoom;
            set => this._MapStartZoom = value;
        }
        public string AdminPW
        {
            get => this._AdminPWVal;
            set => this._AdminPWVal = value;
        }
    }
}

// supports only GET and POST methods

class Http {

  // https://stackoverflow.com/questions/6566456/how-to-serialize-an-object-into-a-list-of-parameters
  static toParams(obj) {
    var str = "";
    for (var key in obj) {
      if (str != "" && obj.hasOwnProperty(key)) {
        str += "&";
      }
      str += key + "=" + encodeURIComponent(obj[key]);
    }
    return str;
  }

  static parseResponse(http, cb) {
    try {
      let data = JSON.parse(http.responseText);
      let res = {
        xmlhttp: http,
        status: http.status,
        data: data
      }
      cb(null, res);
    } catch (e) {
      let data = {error: e.toString()};
      let res = {
        xmlhttp: http,
        status: http.status,
        data: data
      }
      cb(res);
    }
  }

  static request(method, url, data) {
    return new window.Promise((resolve, reject) => {
      var http = new XMLHttpRequest();
      http.onreadystatechange = function() {
        if (http.readyState === XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
          Http.parseResponse(http, function (err, res) {
            if (http.status == 200 && !err){
              resolve(res)
            } else {
              reject(err || res)
            }
          });
        }
      };

      http.open(method, url, true);

      if (method == "POST") {
        //Send the proper header information along with the request
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        var params = Http.toParams(data);
        http.send(params);
      } else {
        http.send();
      }
    });
  }

  static post(url, data) {
    return Http.request("POST", url, data);
  }

  static get(url, cb, errCb) {
    return Http.request("GET", url);
  }

}

export default Http


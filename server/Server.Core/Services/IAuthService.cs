using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
namespace Server.Core.Services
{
    public interface IAuthService
    {
        public Task<string> Authenticate(HttpContext httpContext, string username, string password);
    }
}

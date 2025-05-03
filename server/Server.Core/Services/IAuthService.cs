using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.Services
{
    public interface IAuthService
    {
        public Task<string> Authenticate(string username, string password);
    }
}

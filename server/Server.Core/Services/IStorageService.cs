using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.Services
{
    public interface IStorageService
    {
        public  Task<Stream> DownloadFileAsync(string fileName);
        public  Task<string> UploadFileAsync(string filePath, string objectName);
        public Task<bool> DeleteFileAsync(string objectName);
    }
}

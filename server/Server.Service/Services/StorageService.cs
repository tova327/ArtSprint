using Google.Cloud.Storage.V1;
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.IO.Pipes;
using System.Net.Mime;
using Server.Core.Services;
using HeyRed.ImageSharp.Heif;
using Microsoft.AspNetCore.StaticFiles;
public class StorageService:IStorageService
{
    private readonly string _bucketName;
    private readonly StorageClient _storageClient;

    public StorageService()
    {
        _bucketName = "art-sprint-bucket";
        _storageClient = StorageClient.Create(
            Google.Apis.Auth.OAuth2.GoogleCredential.FromFile(@"D:\Users\User\Desktop\טובי\2025\פרויקט פולסטק סופי\bold-syntax-457715-f1-66c94021f9f8.json"));
    }

    public string UploadFileAsync(string filePath, string objectName)
    {
        if (!File.Exists(filePath))
        {
            throw new FileNotFoundException($"The file {filePath} does not exist.");
        }

        objectName ??= Path.GetFileName(filePath);

        using var fileStream = File.OpenRead(filePath);
        _storageClient.UploadObject(_bucketName, objectName, null, fileStream);
        return $"File {filePath} uploaded to {_bucketName} as {objectName}.";
        //if (!File.Exists(filePath))
        //{
        //    throw new FileNotFoundException($"The file {filePath} does not exist.");
        //}
        //try
        //{
        //    //var path=file.OpenReadStream();
        //    //var path1 = File.OpenRead("fghjhk");
        //    //using (var memoryStream = new MemoryStream())
        //    using(var fileStream = File.OpenRead(filePath))
        //    {
        //        //await file.CopyToAsync(memoryStream);
        //        //memoryStream.Position = 0;
        //        //await _storageClient.UploadObjectAsync(_bucketName, objectName, file.ContentType, memoryStream);
        //        //Console.WriteLine($"File {objectName} uploaded to bucket {_bucketName}.");

        //        var provider = new FileExtensionContentTypeProvider();

        //        if(provider.TryGetContentType(filePath, out string contentType))
        //        {
        //            await _storageClient.UploadObjectAsync(_bucketName, objectName, contentType, fileStream);
        //        }
        //        else
        //        {
        //            await _storageClient.UploadObjectAsync(_bucketName, objectName, "application/octet-stream", fileStream);
        //        }

        //        Console.WriteLine($"File {objectName} uploaded to bucket {_bucketName}.");
        //        //await _storageClient.UploadObjectAsync(
        //        //    bucket: _bucketName,
        //        //    objectName: objectName,
        //        //    contentType: file.ContentType,
        //        //    stream: memoryStream
        //        //);

        //        return $"https://storage.cloud.google.com/{_bucketName}/{objectName}";
        //    }
        //}
        //catch (Exception ex)
        //{
        //    // Log the exception details for debugging.  Include ex.ErrorCode and ex.Message
        //    Console.WriteLine($"Error uploading file: {ex.Message}");
        //    throw; // Re-throw the exception so the calling code knows there was an error.
        //}
    }

    public async Task<Stream> DownloadFileAsync(string fileName)
    {

        try
        {
            var memoryStream = new MemoryStream();
            await _storageClient.DownloadObjectAsync(_bucketName, fileName, memoryStream);
            memoryStream.Position = 0;
            return memoryStream;
        }
        //catch (Google.GoogleApiException ex)
        //{
        //    if (ex.HttpStatusCode == System.Net.HttpStatusCode.NotFound)
        //    {
        //        return null;
        //    }
        //    throw;
        //}
        catch (Exception)
        {
            throw;
        }
    }
}

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
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

public class StorageService:IStorageService
{
    private readonly string _bucketName;
    private readonly StorageClient _storageClient;
    

    public StorageService()
    {
        _bucketName = "art-sprint-bucket";
        var credentialsJsonRaw = Environment.GetEnvironmentVariable("GOOGLE_CREDENTIALS_JSON");

        if (string.IsNullOrWhiteSpace(credentialsJsonRaw))
            throw new InvalidOperationException("GOOGLE_CREDENTIALS_JSON is missing");

        // שלב 1 – להמיר את המחרוזת החיצונית
        var unescapedJson = JsonConvert.DeserializeObject<string>(credentialsJsonRaw);

        // שלב 2 – עכשיו באמת לפרסר את ה־JSON עצמו
        var json = JsonConvert.DeserializeObject<JObject>(unescapedJson);

        // כתיבה לקובץ
        var tempPath = Path.Combine(Path.GetTempPath(), "google-credentials.json");
        File.WriteAllText(tempPath, json.ToString(Formatting.Indented));

        // קביעת משתנה סביבה
        Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", tempPath);

        // יצירת לקוח Google Storage
        _storageClient = StorageClient.Create();

        

    }

    public async Task<string> UploadFileAsync(string filePath, string objectName)
    {

        if (!File.Exists(filePath))
        {
            throw new FileNotFoundException($"The file {filePath} does not exist.");
        }
        try
        {
            
            using (var fileStream = File.OpenRead(filePath))
            {
                

                var provider = new FileExtensionContentTypeProvider();

                if (provider.TryGetContentType(filePath, out string contentType))
                {
                    if (contentType.Contains("text/plain"))
                    {
                        await _storageClient.UploadObjectAsync(_bucketName, objectName, "text/plain; charset=utf-8", fileStream);
                    }
                    else
                    {
                        await _storageClient.UploadObjectAsync(_bucketName, objectName, contentType, fileStream);

                    }
                }
                else
                {
                    await _storageClient.UploadObjectAsync(_bucketName, objectName, "application/octet-stream", fileStream);
                }

                Console.WriteLine($"File {objectName} uploaded to bucket {_bucketName}.");
                

                return $"https://storage.cloud.google.com/{_bucketName}/{objectName}";
            }
        }
        catch (Exception ex)
        {
            // Log the exception details for debugging.  Include ex.ErrorCode and ex.Message
            Console.WriteLine($"Error uploading file: {ex.Message}");
            throw; // Re-throw the exception so the calling code knows there was an error.
        }
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
        
        catch (Exception)
        {
            throw;
        }
    }
    public async Task<bool> DeleteFileAsync(string objectName)
    {
        try
        {
            await _storageClient.DeleteObjectAsync(_bucketName, objectName);
            return true; // Deletion successful
        }
        catch (Google.GoogleApiException ex)
        {
            // Handle specific Google API exceptions, e.g., file not found, permissions issue.
            Console.WriteLine($"Error deleting file: {ex.Message}");

            // Example: Check for "Not Found" error
            if (ex.Error.Code == 404)
            {
                Console.WriteLine($"File '{objectName}' not found in bucket '{_bucketName}'.");
            }
            else if (ex.Error.Code == 403)
            {
                Console.WriteLine($"Insufficient permissions to delete file '{objectName}' in bucket '{_bucketName}'.");
            }

            return false; // Deletion failed
        }
        catch (System.Exception ex)
        {
            // Handle any other exceptions (e.g., network issues)
            Console.WriteLine($"Unexpected error deleting file: {ex.Message}");
            return false; // Deletion failed
        }
    }

}

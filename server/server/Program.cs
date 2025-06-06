using Server.Core;
using server;
using System.Text.Json.Serialization;
using Server.Core.Repositories;
using Server.Core.Services;
using Server.Data.repositories;
using Server.Data;
using Server.Service.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            options.JsonSerializerOptions.WriteIndented = true;
        });
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", builder =>
            {
                builder.WithOrigins("https://artsprint.onrender.com")
                       .AllowAnyMethod()
                       .AllowAnyHeader()
                       .AllowCredentials();
            });
        });


        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["JwtSettings:Issuer"], 
                    ValidAudience = builder.Configuration["JwtSettings:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"]))
                };
            });

        // Add services to the container.

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(options =>
        {
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Scheme = "Bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Name = "Authorization",
                Description = "Bearer Authentication with JWT Token",
                Type = SecuritySchemeType.Http
            });
            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Id = "Bearer",
                    Type = ReferenceType.SecurityScheme
                }
            },
            new List<string>()
        }
            });
        });
        builder.Services.AddDbContext<DataContext>();
        builder.Services.AddHttpClient();
        //=================
        builder.Services.AddScoped<IRepositoryManager, RepositoryManager>();

        builder.Services.AddScoped<IUserRepository, UserRepository>();
        builder.Services.AddScoped<ICompetitionRepository, CompetitionRepository>();
        builder.Services.AddScoped<ICompetitionPaintingRepository, CompetitionPaintingRepository>();
        builder.Services.AddScoped<ICommentRepository, CommentRepository>();
        builder.Services.AddScoped<IPaintingRepository, PaintingRepository>();

        builder.Services.AddScoped<ICompetitionPaintingService, CompetitionPaintingService>();
        builder.Services.AddScoped<IUserService, UserService>();
        builder.Services.AddScoped<ICommentService, CommentService>();
        builder.Services.AddScoped<ICompetitionService, CompetitionService>();
        builder.Services.AddScoped<IPaintingService, PaintingService>();
        builder.Services.AddScoped<IStorageService, StorageService>();
        builder.Services.AddScoped<IDataContext, DataContext>();
        builder.Services.AddScoped<IAuthService, AuthService>();
        builder.Services.AddScoped<IAIService,AIService>();
        //==================
        builder.Services.AddAutoMapper(typeof(MappingProfile), typeof(MappingPostProfile));
        builder.Services.AddDbContext<IDataContext, DataContext>();
        var app = builder.Build();

        // Configure the HTTP request pipeline.
        //if (app.Environment.IsDevelopment())
        //{
        app.UseSwagger();
        app.UseSwaggerUI();
        //}

        app.UseHttpsRedirection();
        app.UseCors("AllowAll");
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
        app.MapGet("/", () => "ArtSprint server is running");
        app.Run();
    }
}
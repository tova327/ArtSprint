using Microsoft.Extensions.Configuration;
using Server.Core.Repositories;
using Server.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BCrypt.Net;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Http;

public class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;
    private readonly IUserRepository _userRepository;

    public AuthService(IConfiguration configuration,IUserRepository userRepository)
    {
        _configuration = configuration;
        _userRepository = userRepository;
    }

    public async Task<string> Authenticate(HttpContext httpContext, string username, string password)
    {
        // Step 1: Fetch the user from the database using the repository layer
        var user = await _userRepository.GetUserByUsername(username);

        // Step 2: Check if the user exists
        if (user == null)
            return null; // User not found

        // Step 3: Verify the hashed password
        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(password, user.HashedPassword);
        if (!isPasswordValid)
            return null; // Invalid password

        // If valid, proceed to generate the JWT token
        var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, username),
        new Claim(ClaimTypes.Role, user.Role) // Assuming user role is stored in the database
    };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"])); 
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _configuration["JwtSettings:Issuer"], // Changed to environment variable access
            audience: _configuration["JwtSettings:Audience"], // Changed to environment variable access
            claims: claims,
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: creds);

        var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);

        // Set the JWT token as a cookie
        //httpContext.Response.Cookies.Append("authToken", jwtToken, new CookieOptions
        //{
        //    HttpOnly = true,
        //    Secure = true, // Set to true if using HTTPS
        //    SameSite = SameSiteMode.Lax,
        //    Expires = DateTimeOffset.UtcNow.AddMinutes(30)
        //});

        return jwtToken; // Return the token as before
    }



}

using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using PawsAndRescueApi.Models;
using PawsAndRescueApi.DTOs;
using BCrypt.Net;
using PawsAndRescueApi.Data;

namespace PawsAndRescueApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
  private readonly IConfiguration _configuration;
  private readonly AppDbContext _context;

  public AuthController(IConfiguration configuration, AppDbContext context)
  {
    _configuration = configuration;
    _context = context;
  }

  [HttpPost("register")]
  public IActionResult Register(RegisterDto request)
  {
    if (_context.Users.Any(u => u.Email == request.Email)) return BadRequest("User exists");

    string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

    var user = new User
    {
      Name = request.Name,
      Email = request.Email,
      PasswordHash = passwordHash,
      Role = request.Role
    };

    _context.Users.Add(user);
    _context.SaveChanges();

    return Ok(new { Message = "User registered successfully!" });
  }

  [HttpPost("login")]
  public IActionResult Login(LoginDto request)
  {
    var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);

    if (user == null)
      return BadRequest("User not found.");

    if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
      return BadRequest("Wrong password.");

    string token = CreateToken(user);

    return Ok(new AuthResponseDto
    {
      Token = token,
      Name = user.Name,
      Role = user.Role.ToString()
    });
  }

  private string CreateToken(User user)
  {
    List<Claim> claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

    var key = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]!));

    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

    var token = new JwtSecurityToken(
        issuer: _configuration["JwtSettings:Issuer"],
        audience: _configuration["JwtSettings:Audience"],
        claims: claims,
        expires: DateTime.Now.AddDays(1),
        signingCredentials: creds
    );

    var jwt = new JwtSecurityTokenHandler().WriteToken(token);

    return jwt;
  }
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PawsAndRescueApi.Data;
using PawsAndRescueApi.Models;

namespace PawsAndRescueApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
  //the connection to the database
  private readonly AppDbContext _context;

  //constructor
  public UsersController(AppDbContext contextGiven)
  {
    _context = contextGiven;
  }

  //returns all of the users
  [HttpGet]
  public async Task<ActionResult<IEnumerable<User>>> GetUsers()
  {
    return await _context.Users.ToListAsync();
  }

  //adds a new user to the database
  [HttpPost]
  public async Task<ActionResult<User>> AddUser(User userGiven)
  {
    _context.Users.Add(userGiven);
    await _context.SaveChangesAsync();

    return Ok(userGiven);
  }
}

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

  //modifies an already existing user
  [HttpPut("{id}")]
  public async Task<IActionResult> UpdateUser(int id, User userGiven)
  {
    if (id != userGiven.Id)
    {
      return BadRequest();
    }

    _context.Entry(userGiven).State = EntityState.Modified;

    try
    {
      await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
      if (!_context.Users.Any(u => u.Id == id))
      {
        return NotFound();
      }
      throw;
    }
    return NoContent();
  }

  //deletes an already existing user
  [HttpDelete("{id}")]
  public async Task<IActionResult> DeleteUser(int id)
  {
    var user = await _context.Users.FindAsync(id);

    if (user == null)
    {
      return NotFound();
    }

    _context.Users.Remove(user);
    await _context.SaveChangesAsync();

    return NoContent();
  }
}

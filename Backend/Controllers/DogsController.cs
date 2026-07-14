using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PawsAndRescueApi.Models;
using PawsAndRescueApi.Data;

namespace PawsAndRescueApi.Controllers;

[ApiController] //sends back a successful code or not
[Route("api/[controller]")] // the route will be /api/dogs
public class DogsController : ControllerBase
{
  //connection to the database
  private readonly AppDbContext _context;

  // constructor: for managing the database
  public DogsController(AppDbContext contextGiven)
  {
    _context = contextGiven;
  }

  //gets the dog list that is returned with a succes code 
  [HttpGet]
  public async Task<ActionResult<IEnumerable<Dog>>> GetDogs()
  {
    return await _context.Dogs.ToListAsync();
  }

  //adds a dog 
  [HttpPost]
  public async Task<ActionResult<Dog>> AddDog(Dog dog)
  {
    _context.Dogs.Add(dog);
    await _context.SaveChangesAsync(); //only here its saved to the database

    return Ok(dog);
  }

  //modifying an existing dog
  [HttpPut("{id}")]
  public async Task<IActionResult> UpdateDog(int id, Dog dogGiven)
  {
    if (id != dogGiven.Id)
    {
      return BadRequest();
    }

    _context.Entry(dogGiven).State = EntityState.Modified; // where it is modified 

    try
    {
      await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
      if (!_context.Dogs.Any(d => d.Id == id))
      {
        return NotFound(); // it was not found
      }
      throw;
    }
    return NoContent(); //nothing to show 
  }

  //deleting a dog
  [HttpDelete("{id}")]
  public async Task<IActionResult> DeleteDog(int id)
  {
    var dog = await _context.Dogs.FindAsync(id);

    if (dog == null)
    {
      return NotFound();
    }

    _context.Dogs.Remove(dog);

    await _context.SaveChangesAsync();

    return NoContent();
  }
}

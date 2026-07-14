using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PawsAndRescueApi.Models;
using PawsAndRescueApi.Data;

namespace PawsAndRescueApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShiftsController : ControllerBase
{
  //the connection to the database
  private readonly AppDbContext _context;

  //constructor
  public ShiftsController(AppDbContext contextGiven)
  {
    _context = contextGiven;
  }

  //gets all the shifts
  [HttpGet]
  public async Task<ActionResult<IEnumerable<Shift>>> GetShifts()
  {
    return await _context.Shifts.ToListAsync();
  }

  //adds a new shift 
  [HttpPost]
  public async Task<ActionResult<Shift>> AddShift(Shift shiftGiven)
  {
    _context.Shifts.Add(shiftGiven);
    await _context.SaveChangesAsync();

    return Ok(shiftGiven);
  }

  //modifies an existing shift
  [HttpPut("{id}")]
  public async Task<IActionResult> UpdateShift(int id, Shift shiftGiven)
  {
    if (id != shiftGiven.Id)
    {
      return BadRequest();
    }

    _context.Entry(shiftGiven).State = EntityState.Modified;

    try
    {
      await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
      if (!_context.Shifts.Any(s => s.Id == id))
      {
        return NotFound();
      }
      throw;
    }
    return NoContent();
  }

  //deletes an already existing shift
  [HttpDelete("{id}")]
  public async Task<IActionResult> DeleteShift(int id)
  {
    var shift = await _context.Shifts.FindAsync(id);

    if (shift == null)
    {
      return NotFound();
    }

    _context.Shifts.Remove(shift);
    await _context.SaveChangesAsync();

    return NoContent();
  }

}

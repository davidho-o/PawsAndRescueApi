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
}

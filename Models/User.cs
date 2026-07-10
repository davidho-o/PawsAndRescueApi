namespace PawsAndRescueApi.Models;

public enum UserRole
{
  Volunteer,
  Manager
}

public class User
{
  public int Id { get; set; }

  public string Name { get; set; } = string.Empty;

  public string Email { get; set; } = string.Empty;

  public string Password { get; set; } = string.Empty;

  //role can be either volunteer or manager
  public UserRole Role { get; set; } = UserRole.Volunteer;

  //if the volunteer signed the agreements or not
  public bool SignedAgreements { get; set; } = false;

}
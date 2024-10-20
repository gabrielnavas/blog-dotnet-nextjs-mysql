using Microsoft.EntityFrameworkCore;
using api;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

//cors
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
    policy =>
    {
        // TODO: mudar isso para ambiente de produção
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});


// politicas e regras de autorizacao
builder.Services.AddAuthorization(options =>
      {
          options.AddPolicy("Admin", policy => policy.RequireRole(Role.Admin.ToString()));
          options.AddPolicy("Manager", policy => policy.RequireRole(Role.Manager.ToString()));
          options.AddPolicy("User", policy => policy.RequireRole(Role.User.ToString()));
      });

// carregar as envs na classe AppSettings
builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));

// obter a chave em array de bytes
var appSettings = builder.Configuration.GetSection("AppSettings").Get<AppSettings>();
var key = Encoding.ASCII.GetBytes(appSettings.JwtKey);

// adicionar filtro de autenticacao JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
    };
});



// injetar os services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPostService, PostServices>();

// injetar o context
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<BloggingContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// adicionar suporte a controllers
builder.Services.AddControllers();

var app = builder.Build();

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

import { CodeBlock } from "@/components/code-block";

export function DipContentEn() {
  return (
    <>
      {/* Introduction */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Introduction</h2>
        <p>
          The Dependency Inversion Principle (DIP) states two things:{" "}
          <span className="font-semibold">
            high-level modules should not depend on low-level modules, both
            should depend on abstractions
          </span>
          . And:{" "}
          <span className="font-semibold">
            abstractions should not depend on details, details should depend on
            abstractions
          </span>
          .
        </p>
        <p>
          In practice, DIP means your business logic (commands, handlers, domain
          services) should never directly reference infrastructure details
          (database connections, cloud SDKs, HTTP clients). Instead, they
          reference interfaces. The concrete implementations are injected at
          runtime through a dependency injection container.
        </p>
        <p>
          This principle is the capstone of SOLID. SRP ensures each class has
          one responsibility. OCP enables extension without modification. LSP
          guarantees subtypes are safe. ISP keeps interfaces focused. DIP ties
          them all together by ensuring that the direction of dependencies flows
          from concrete details toward stable abstractions.
        </p>
        <p>
          In this article, we explore DIP through a real-world scenario:
          building a Community of Practice management system. You will see how
          Gathering&apos;s architecture inverts dependencies across every layer,
          and what happens when you skip this step.
        </p>
      </div>

      {/* The Problem */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          The Problem: High-Level Code Chained to Low-Level Details
        </h2>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          A Simple Example: Notification Service
        </h3>

        <p>
          Before diving into the Gathering codebase, let&apos;s see a simple DIP
          violation: a notification service that directly depends on an email
          library. This illustrates the core principle without needing
          application context.
        </p>

        <h4 className="text-base font-semibold text-foreground mt-4">
          Without DIP: Direct Dependency on Implementation
        </h4>

        <CodeBlock language="csharp">{`public class OrderService
{
    // Direct dependency on a concrete email library
    private readonly SmtpClient _smtpClient;
    private readonly SqlConnection _database;

    public OrderService()
    {
        // Creates its own dependencies - tightly coupled
        _smtpClient = new SmtpClient("smtp.company.com", 587);
        _database = new SqlConnection(
            "Server=prod-db;Database=Orders;...");
    }

    public void PlaceOrder(Order order)
    {
        // Business logic mixed with infrastructure
        _database.Open();
        var cmd = new SqlCommand(
            "INSERT INTO Orders ...", _database);
        cmd.ExecuteNonQuery();
        _database.Close();

        // Directly coupled to SMTP implementation
        var message = new MailMessage(
            "noreply@company.com",
            order.CustomerEmail,
            "Order Confirmed",
            $"Your order {order.Id} has been placed.");
        _smtpClient.Send(message);
    }
}`}</CodeBlock>

        <p className="mt-4">
          <span className="font-semibold">The problem:</span> OrderService
          directly creates SmtpClient and SqlConnection. You cannot test without
          a real SMTP server and database. You cannot switch from SMTP to
          SendGrid, or from SQL Server to PostgreSQL, without rewriting
          OrderService. The high-level policy (placing orders) is chained to
          low-level details (SMTP, SQL).
        </p>

        <h4 className="text-base font-semibold text-foreground mt-4">
          With DIP: Depend on Abstractions
        </h4>

        <CodeBlock language="csharp">{`// Abstractions defined by the high-level module
public interface IOrderRepository
{
    Task SaveOrderAsync(Order order, CancellationToken ct = default);
}

public interface INotificationService
{
    Task SendOrderConfirmationAsync(Order order, CancellationToken ct = default);
}

// High-level module depends on abstractions
public class OrderService
{
    private readonly IOrderRepository _repository;
    private readonly INotificationService _notificationService;

    // Dependencies are INJECTED, not created
    public OrderService(
        IOrderRepository repository,
        INotificationService notificationService)
    {
        _repository = repository;
        _notificationService = notificationService;
    }

    public async Task PlaceOrderAsync(Order order, CancellationToken ct)
    {
        await _repository.SaveOrderAsync(order, ct);
        await _notificationService.SendOrderConfirmationAsync(order, ct);
    }
}

// Low-level modules implement the abstractions
public class SqlOrderRepository : IOrderRepository
{
    private readonly DbContext _dbContext;

    public SqlOrderRepository(DbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task SaveOrderAsync(Order order, CancellationToken ct)
    {
        _dbContext.Orders.Add(order);
        await _dbContext.SaveChangesAsync(ct);
    }
}

public class SmtpNotificationService : INotificationService
{
    private readonly SmtpClient _smtpClient;

    public SmtpNotificationService(SmtpClient smtpClient)
    {
        _smtpClient = smtpClient;
    }

    public async Task SendOrderConfirmationAsync(
        Order order, CancellationToken ct)
    {
        var message = new MailMessage(
            "noreply@company.com",
            order.CustomerEmail,
            "Order Confirmed",
            $"Your order {order.Id} has been placed.");
        await _smtpClient.SendMailAsync(message, ct);
    }
}`}</CodeBlock>

        <div className="rounded-lg border border-green-600 bg-green-50 p-4 my-6 dark:bg-green-950/30">
          <p className="font-semibold text-green-900 dark:text-green-100 mb-3">
            Benefits of DIP Here:
          </p>
          <ul className="text-sm text-green-900 dark:text-green-100 space-y-2">
            <li>
              <span className="font-semibold">✓ Testable:</span> Inject mock
              implementations. No real database or SMTP server needed.
            </li>
            <li>
              <span className="font-semibold">✓ Swappable:</span> Switch from
              SMTP to SendGrid by creating a new INotificationService
              implementation. OrderService never changes.
            </li>
            <li>
              <span className="font-semibold">✓ Decoupled:</span> OrderService
              knows nothing about SQL, SMTP, or any infrastructure. It speaks
              only in abstractions.
            </li>
          </ul>
        </div>

        <p className="mt-6">
          This simple pattern, injecting abstractions instead of creating
          concrete dependencies, is the foundation of DIP. Now let&apos;s apply
          it to a larger, real-world system.
        </p>
      </div>

      {/* Case Study: Gathering Architecture */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Case Study: Dependency Architecture in Gathering
        </h2>

        <p>
          Gathering&apos;s architecture is a textbook example of DIP applied at
          the architectural level. The project has four layers, and the
          dependency flow is deliberately inverted:
        </p>

        <div className="rounded-lg border border-blue-600 bg-blue-50 p-4 my-6 dark:bg-blue-950/30">
          <p className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Layer Dependency Flow:
          </p>
          <ul className="text-sm text-blue-900 dark:text-blue-100 space-y-2">
            <li>
              <span className="font-semibold">Gathering.SharedKernel:</span>{" "}
              Base types (Entity, Result, Error). Depends on nothing.
            </li>
            <li>
              <span className="font-semibold">Gathering.Domain:</span> Entities
              and repository interfaces. Depends only on SharedKernel.
            </li>
            <li>
              <span className="font-semibold">Gathering.Application:</span>{" "}
              Command handlers, query handlers, abstractions. Depends on Domain
              and SharedKernel.
            </li>
            <li>
              <span className="font-semibold">Gathering.Infrastructure:</span>{" "}
              EF Core, Azure Blob Storage, implementations. Depends on
              Application and Domain
              <span className="font-semibold">
                implements their abstractions
              </span>
              .
            </li>
            <li>
              <span className="font-semibold">Gathering.Api:</span> Endpoints
              and DI composition root. Wires everything together.
            </li>
          </ul>
        </div>

        <p>
          The critical insight: Infrastructure depends on Domain and
          Application, not the other way around. The high-level business logic
          defines the interfaces; the low-level infrastructure implements them.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          The Violation: Handler Coupled to Azure SDK
        </h3>

        <p>
          Imagine a developer skips the abstraction and references Azure Blob
          Storage directly in the command handler:
        </p>

        <CodeBlock language="csharp">{`// ✗ VIOLATION: High-level handler directly depends on Azure SDK
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

public sealed class CreateCommunityCommandHandler
{
    private readonly ApplicationDbContext _dbContext;
    private readonly BlobServiceClient _blobServiceClient;

    public CreateCommunityCommandHandler(
        ApplicationDbContext dbContext,
        BlobServiceClient blobServiceClient)  // Direct Azure SDK dependency!
    {
        _dbContext = dbContext;
        _blobServiceClient = blobServiceClient;
    }

    public async Task<Result<Guid>> HandleAsync(
        CreateCommunityCommand command, CancellationToken ct)
    {
        var result = Community.Create(command.Name, command.Description);
        if (result.IsFailure) return Result.Failure<Guid>(result.Error);

        // Business logic polluted with Azure-specific code
        if (command.ImageStream is not null)
        {
            var containerClient = _blobServiceClient
                .GetBlobContainerClient("images");
            await containerClient.CreateIfNotExistsAsync(
                cancellationToken: ct);

            var extension = Path.GetExtension(command.ImageFileName).ToLower();
            var blobName = $"communities/{Guid.NewGuid()}{extension}";
            var blobClient = containerClient.GetBlobClient(blobName);

            command.ImageStream.Seek(0, SeekOrigin.Begin);
            var uploadOptions = new BlobUploadOptions
            {
                HttpHeaders = new BlobHttpHeaders 
                { 
                    ContentType = command.ImageContentType 
                }
            };

            await blobClient.UploadAsync(
                command.ImageStream, uploadOptions, ct);

            // Azure-specific URI construction
            result.Value.Update(
                command.Name, command.Description, 
                blobClient.Uri.AbsoluteUri);
        }

        _dbContext.Communities.Add(result.Value);
        await _dbContext.SaveChangesAsync(ct);

        return Result.Success(result.Value.Id);
    }
}`}</CodeBlock>

        <div className="rounded-lg border border-red-600 bg-red-50 p-4 my-4 dark:bg-red-950/30">
          <p className="font-semibold text-red-900 dark:text-red-100 mb-3">
            Problems with Direct Dependencies:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-red-900 dark:text-red-100">
            <li>
              <span className="font-semibold">Untestable:</span> Testing
              requires a real Azure Blob Storage account. You cannot unit test
              the business logic without cloud infrastructure.
            </li>
            <li>
              <span className="font-semibold">Locked to Azure:</span> Switching
              to AWS S3 or local storage means rewriting the handler. Business
              logic and infrastructure are inseparable.
            </li>
            <li>
              <span className="font-semibold">
                Application layer references Infrastructure:
              </span>{" "}
              The handler (Application layer) imports Azure.Storage.Blobs
              (Infrastructure detail). The dependency arrow points the wrong
              way.
            </li>
            <li>
              <span className="font-semibold">Leaked abstractions:</span>{" "}
              BlobServiceClient, BlobContainerClient, BlobUploadOptions, all
              Azure-specific types leak into business logic.
            </li>
            <li>
              <span className="font-semibold">Mixed responsibilities:</span> The
              handler knows how Azure generates blob names, how to set content
              types, and how URIs work. That is not its job.
            </li>
          </ul>
        </div>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          The Right Approach: Abstractions Owned by High-Level Modules
        </h3>

        <p>
          Gathering inverts this dependency. The Application layer defines the
          interface; the Infrastructure layer implements it. The handler never
          sees Azure.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Step 1: Abstraction in the Application Layer
        </h3>

        <CodeBlock language="csharp">{`// From: Gathering.Application/Abstractions/IImageStorageService.cs
// DEFINED in Application - the high-level module OWNS the interface
public interface IImageStorageService
{
    Task<Result<string>> UploadImageAsync(
        Stream imageStream,
        string fileName,
        string contentType,
        string entityType,
        CancellationToken cancellationToken = default);

    Task<Result> DeleteImageAsync(
        string imageUrl, 
        CancellationToken cancellationToken = default);
}`}</CodeBlock>

        <p className="mt-4">
          Notice where this interface lives:{" "}
          <span className="font-mono">Gathering.Application</span>. Not in
          Infrastructure. The high-level module defines what it needs. The
          low-level module adapts to serve it.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Step 2: Implementation in the Infrastructure Layer
        </h3>

        <CodeBlock language="csharp">{`// From: Gathering.Infrastructure/Storage/AzureBlobStorageService.cs
// IMPLEMENTS the interface defined by the Application layer
internal sealed class AzureBlobStorageService(
    BlobServiceClient blobServiceClient) : IImageStorageService
{
    private const string ContainerName = "images";

    public async Task<Result<string>> UploadImageAsync(
        Stream imageStream, string fileName, string contentType,
        string entityType, CancellationToken cancellationToken = default)
    {
        try
        {
            var containerClient = blobServiceClient
                .GetBlobContainerClient(ContainerName);
            await containerClient.CreateIfNotExistsAsync(
                cancellationToken: cancellationToken);

            var extension = Path.GetExtension(fileName).ToLower();
            var blobName = $"{entityType}/{Guid.NewGuid()}{extension}";
            var blobClient = containerClient.GetBlobClient(blobName);

            imageStream.Seek(0, SeekOrigin.Begin);

            var uploadOptions = new BlobUploadOptions
            {
                HttpHeaders = new BlobHttpHeaders 
                { 
                    ContentType = contentType 
                }
            };

            await blobClient.UploadAsync(
                imageStream, uploadOptions, cancellationToken);

            return Result.Success(blobClient.Uri.AbsoluteUri);
        }
        catch (Exception ex)
        {
            return Result.Failure<string>(
                ImageStorageError.UploadFailed(ex.Message));
        }
    }

    public async Task<Result> DeleteImageAsync(
        string imageUrl, CancellationToken cancellationToken = default)
    {
        try
        {
            var uri = new Uri(imageUrl);
            var blobClient = new BlobClient(uri);
            await blobClient.DeleteIfExistsAsync(
                cancellationToken: cancellationToken);

            return Result.Success();
        }
        catch (Exception ex)
        {
            return Result.Failure(
                ImageStorageError.DeleteFailed(ex.Message));
        }
    }
}`}</CodeBlock>

        <p className="mt-4">
          All Azure-specific code is isolated here. The class is{" "}
          <span className="font-mono">internal sealed</span>nothing outside
          Infrastructure even knows it exists. The only thing visible is the
          IImageStorageService interface.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Step 3: Handler Depends Only on Abstractions
        </h3>

        <CodeBlock language="csharp">{`// From: Gathering.Application/Communities/Create/CreateCommunityCommandHandler.cs
public sealed class CreateCommunityCommandHandler 
    : ICommandHandler<CreateCommunityCommand, Guid>
{
    private readonly ICommunityRepository _communityRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IValidator<CreateCommunityCommand> _validator;
    private readonly IImageStorageService _imageStorageService;

    // Every dependency is an ABSTRACTION
    public CreateCommunityCommandHandler(
        ICommunityRepository communityRepository,    // Abstraction
        IUnitOfWork unitOfWork,                       // Abstraction
        IValidator<CreateCommunityCommand> validator,  // Abstraction
        IImageStorageService imageStorageService)      // Abstraction
    {
        _communityRepository = communityRepository;
        _unitOfWork = unitOfWork;
        _validator = validator;
        _imageStorageService = imageStorageService;
    }

    public async Task<Result<Guid>> HandleAsync(
        CreateCommunityCommand command, 
        CancellationToken cancellationToken = default)
    {
        var validationResult = await _validator
            .ValidateAsync(command, cancellationToken);
        if (!validationResult.IsValid)
        {
            var errors = string.Join("; ", 
                validationResult.Errors.Select(e => e.ErrorMessage));
            return Result.Failure<Guid>(
                Error.Validation("CreateCommunity.ValidationFailed", errors));
        }

        string? imageUrl = null;
        if (command.ImageStream is not null 
            && command.ImageFileName is not null 
            && command.ImageContentType is not null)
        {
            // Uses the ABSTRACTION - no Azure code here
            var uploadResult = await _imageStorageService.UploadImageAsync(
                command.ImageStream,
                command.ImageFileName,
                command.ImageContentType,
                "communities",
                cancellationToken);

            if (uploadResult.IsFailure)
                return Result.Failure<Guid>(uploadResult.Error);

            imageUrl = uploadResult.Value;
        }

        var result = Community.Create(
            command.Name, command.Description, imageUrl);
        if (result.IsFailure)
        {
            if (imageUrl is not null)
                await _imageStorageService
                    .DeleteImageAsync(imageUrl, cancellationToken);
            return Result.Failure<Guid>(result.Error);
        }

        _communityRepository.Add(result.Value);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(result.Value.Id);
    }
}`}</CodeBlock>

        <div className="rounded-lg border border-emerald-600 bg-emerald-50 p-4 my-4 dark:bg-emerald-950/30">
          <p className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
            DIP in Action, Look at the Imports:
          </p>
          <ul className="text-sm space-y-2 text-emerald-900 dark:text-emerald-100">
            <li>
              <span className="font-semibold">Handler imports:</span>{" "}
              Gathering.Application.Abstractions, Gathering.Domain.Abstractions,
              Gathering.Domain.Communities, Gathering.SharedKernel
            </li>
            <li>
              <span className="font-semibold">Handler does NOT import:</span>{" "}
              Azure.Storage.Blobs, Microsoft.EntityFrameworkCore,
              System.Data.SqlClient, nothing from Infrastructure
            </li>
            <li>
              <span className="font-semibold">Result:</span> The handler can be
              compiled, tested, and run without any Infrastructure assembly
            </li>
          </ul>
        </div>
      </div>

      {/* The Composition Root */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          The Composition Root: Wiring It All Together
        </h2>

        <p>
          If handlers depend on abstractions and infrastructure implements them,
          where does the wiring happen? In the{" "}
          <span className="font-semibold">composition root</span> (the startup
          configuration where the DI container maps interfaces to
          implementations.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Infrastructure DI Registration
        </h3>

        <CodeBlock language="csharp">{`// From: Gathering.Infrastructure/DependencyInjection.cs
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services, IConfiguration configuration)
    {
        // Database - maps IUnitOfWork to ApplicationDbContext
        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                sqlOptions =>
                {
                    sqlOptions.EnableRetryOnFailure(
                        maxRetryCount: 5,
                        maxRetryDelay: TimeSpan.FromSeconds(30),
                        errorNumbersToAdd: null);
                });
        });

        // Time abstraction
        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();

        // Persistence - maps abstractions to implementations
        services.AddScoped<IUnitOfWork>(
            provider => provider.GetRequiredService<ApplicationDbContext>());
        services.AddScoped<ICommunityRepository, CommunityRepository>();
        services.AddScoped<ISessionRepository, SessionRepository>();

        // Storage - maps IImageStorageService to Azure implementation
        var connectionString = configuration
            .GetSection("AzureStorage:ConnectionString").Value
            ?? throw new InvalidOperationException(
                "AzureStorage:ConnectionString is not configured.");
        services.AddSingleton(new BlobServiceClient(connectionString));
        services.AddScoped<IImageStorageService, AzureBlobStorageService>();

        return services;
    }
}`}</CodeBlock>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Application DI Registration
        </h3>

        <CodeBlock language="csharp">{`// From: Gathering.Application/DependencyInjection.cs
public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services)
    {
        // Mediator - maps ISender to Sender
        services.AddScoped<ISender, Sender>();

        // Auto-register all command and query handlers
        var assemblies = new[] { typeof(DependencyInjection).Assembly };
        services.RegisterHandlers(assemblies);

        // Auto-register all FluentValidation validators
        services.AddValidatorsFromAssembly(
            typeof(DependencyInjection).Assembly);

        return services;
    }
}`}</CodeBlock>

        <div className="rounded-lg border border-blue-600 bg-blue-50 p-4 my-6 dark:bg-blue-950/30">
          <p className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
            The DIP Pattern at Every Level:
          </p>
          <ul className="text-sm text-blue-900 dark:text-blue-100 space-y-2">
            <li>
              <span className="font-semibold">
                ICommunityRepository → CommunityRepository:
              </span>{" "}
              Domain defines the interface. Infrastructure provides the EF Core
              implementation.
            </li>
            <li>
              <span className="font-semibold">
                IUnitOfWork → ApplicationDbContext:
              </span>{" "}
              Domain defines the persistence contract. Infrastructure maps it to
              the DbContext.
            </li>
            <li>
              <span className="font-semibold">
                IImageStorageService → AzureBlobStorageService:
              </span>{" "}
              Application defines the storage contract. Infrastructure provides
              the Azure implementation.
            </li>
            <li>
              <span className="font-semibold">
                IDateTimeProvider → DateTimeProvider:
              </span>{" "}
              Even time is abstracted. Tests can inject a fixed time provider
              for deterministic behavior.
            </li>
            <li>
              <span className="font-semibold">ISender → Sender:</span> The
              mediator pattern itself follows DIP, handlers don&apos;t know how
              messages are dispatched.
            </li>
          </ul>
        </div>
      </div>

      {/* Why Abstractions Live in Domain/Application */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Why Abstractions Live in Domain and Application
        </h2>

        <p>
          A critical DIP detail in Gathering: the interfaces are defined{" "}
          <span className="font-semibold">where they are needed</span>, not
          where they are implemented. This is the inversion.
        </p>

        <CodeBlock language="csharp">{`// ✗ WRONG: Interface defined alongside its implementation
// File: Gathering.Infrastructure/Repositories/ISessionRepository.cs
// This would make Domain depend on Infrastructure

// ✓ CORRECT: Interface defined where it's consumed
// File: Gathering.Domain/Sessions/ISessionRepository.cs
// Infrastructure depends on Domain to implement this interface

// The dependency arrows:
// 
// Gathering.Domain (defines ISessionRepository, IUnitOfWork)
//     ↑
// Gathering.Application (defines IImageStorageService, uses Domain interfaces)
//     ↑
// Gathering.Infrastructure (implements ALL interfaces)
//     ↑
// Gathering.Api (composition root, wires interfaces to implementations)`}</CodeBlock>

        <p className="mt-4">
          This is the <span className="font-semibold">inversion</span> in
          Dependency Inversion. Without DIP, the natural dependency flow would
          be:
        </p>

        <CodeBlock language="csharp">{`// Without DIP (traditional dependency flow):
// Domain → Infrastructure (Domain uses SqlConnection directly)
// Application → Infrastructure (Handler uses BlobServiceClient directly)
// This means business logic DEPENDS ON infrastructure details

// With DIP (inverted dependency flow):
// Infrastructure → Domain (Infrastructure implements IRepository)
// Infrastructure → Application (Infrastructure implements IImageStorageService)
// This means infrastructure details DEPEND ON business abstractions`}</CodeBlock>
      </div>

      {/* Testing Benefits */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Testing: Where DIP Pays Off
        </h2>

        <p>
          The most tangible benefit of DIP is testability. Because handlers
          depend on abstractions, you can substitute any implementation,
          including test doubles.
        </p>

        <CodeBlock language="csharp">{`// Unit testing CreateCommunityCommandHandler
// NO Azure account needed. NO database needed.

public class CreateCommunityCommandHandlerTests
{
    [Test]
    public async Task Handle_WithValidCommand_CreatesCommunity()
    {
        // Arrange - all dependencies are test doubles
        var mockRepository = new MockCommunityRepository();
        var mockUnitOfWork = new MockUnitOfWork();
        var mockValidator = new AlwaysValidValidator();
        var mockImageStorage = new InMemoryImageStorage();

        var handler = new CreateCommunityCommandHandler(
            mockRepository,
            mockUnitOfWork,
            mockValidator,
            mockImageStorage);

        var command = new CreateCommunityCommand(
            "Clean Code Community",
            "A community focused on clean code practices");

        // Act
        var result = await handler.HandleAsync(
            command, CancellationToken.None);

        // Assert
        Assert.That(result.IsSuccess, Is.True);
        Assert.That(mockRepository.Added.Count, Is.EqualTo(1));
        Assert.That(
            mockRepository.Added[0].Name, 
            Is.EqualTo("Clean Code Community"));
        Assert.That(mockUnitOfWork.SavedChanges, Is.True);
    }

    [Test]
    public async Task Handle_WithImage_UploadsToStorage()
    {
        var mockImageStorage = new InMemoryImageStorage();
        var handler = new CreateCommunityCommandHandler(
            new MockCommunityRepository(),
            new MockUnitOfWork(),
            new AlwaysValidValidator(),
            mockImageStorage);

        var imageStream = new MemoryStream(new byte[] { 1, 2, 3 });
        var command = new CreateCommunityCommand(
            "Community", "Description")
        {
            ImageStream = imageStream,
            ImageFileName = "logo.png",
            ImageContentType = "image/png"
        };

        await handler.HandleAsync(command, CancellationToken.None);

        // Verify image was uploaded through the abstraction
        Assert.That(mockImageStorage.UploadedFiles.Count, Is.EqualTo(1));
        Assert.That(
            mockImageStorage.UploadedFiles[0].EntityType, 
            Is.EqualTo("communities"));
    }
}

// Test double - trivial to implement because the interface is small
public class InMemoryImageStorage : IImageStorageService
{
    public List<(Stream Stream, string FileName, string EntityType)> 
        UploadedFiles = new();

    public Task<Result<string>> UploadImageAsync(
        Stream imageStream, string fileName, string contentType,
        string entityType, CancellationToken ct = default)
    {
        UploadedFiles.Add((imageStream, fileName, entityType));
        return Task.FromResult(
            Result.Success($"https://test.blob.core/{entityType}/{fileName}"));
    }

    public Task<Result> DeleteImageAsync(
        string imageUrl, CancellationToken ct = default)
    {
        return Task.FromResult(Result.Success());
    }
}`}</CodeBlock>
      </div>

      {/* TypeScript Section */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          DIP in TypeScript
        </h2>

        <p>
          TypeScript achieves DIP through interfaces and constructor injection.
          Here is the same pattern in a Node.js/Express context:
        </p>

        <CodeBlock language="typescript">
          {`// Abstractions - defined by the high-level module
interface ICommunityRepository {
  getById(id: string): Promise<Community | null>;
  getAll(): Promise<ReadonlyArray<Community>>;
  add(community: Community): void;
}

interface IUnitOfWork {
  saveChanges(): Promise<number>;
}

interface IImageStorageService {
  uploadImage(
    stream: NodeJS.ReadableStream,
    fileName: string,
    contentType: string,
    entityType: string
  ): Promise<Result<string>>;

  deleteImage(imageUrl: string): Promise<Result<void>>;
}

// High-level module - depends ONLY on abstractions
class CreateCommunityHandler {
  constructor(
    private repository: ICommunityRepository,
    private unitOfWork: IUnitOfWork,
    private imageStorage: IImageStorageService
  ) {}

  async handle(command: CreateCommunityCommand): Promise<Result<string>> {
    const result = Community.create(command.name, command.description);
    if (!result.isSuccess) return failure(result.error);

    if (command.imageStream) {
      const uploadResult = await this.imageStorage.uploadImage(
        command.imageStream,
        command.imageFileName,
        command.imageContentType,
        "communities"
      );

      if (!uploadResult.isSuccess) {
        return failure(uploadResult.error);
      }
    }

    this.repository.add(result.value);
    await this.unitOfWork.saveChanges();
    return success(result.value.id);
  }
}

// Low-level module - Azure implementation
class AzureBlobImageStorage implements IImageStorageService {
  constructor(private blobServiceClient: BlobServiceClient) {}

  async uploadImage(
    stream: NodeJS.ReadableStream,
    fileName: string,
    contentType: string,
    entityType: string
  ): Promise<Result<string>> {
    const containerClient = this.blobServiceClient
      .getContainerClient("images");
    const ext = fileName.slice(fileName.lastIndexOf("."));
    const blobName = entityType + "/" + crypto.randomUUID() + ext;
    const blobClient = containerClient.getBlockBlobClient(blobName);

    await blobClient.uploadStream(stream);
    return success(blobClient.url);
  }

  async deleteImage(imageUrl: string): Promise<Result<void>> {
    const blobClient = new BlobClient(imageUrl);
    await blobClient.delete();
    return success(undefined);
  }
}

// Composition root (e.g., in app bootstrap)
function configureServices(): CreateCommunityHandler {
  const blobClient = new BlobServiceClient(connectionString);
  const dbContext = new PrismaClient();

  const repository = new PrismaCommunityRepository(dbContext);
  const unitOfWork = new PrismaUnitOfWork(dbContext);
  const imageStorage = new AzureBlobImageStorage(blobClient);

  return new CreateCommunityHandler(repository, unitOfWork, imageStorage);
}

// Test setup - swap implementations without changing handler
function createTestHandler(): CreateCommunityHandler {
  return new CreateCommunityHandler(
    new InMemoryCommunityRepository(),
    new InMemoryUnitOfWork(),
    new InMemoryImageStorage()
  );
}`}
        </CodeBlock>
      </div>

      {/* Benefits */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Benefits of Applying DIP
        </h2>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          1. True Unit Testing
        </h3>
        <p>
          Every handler can be tested in complete isolation. No database, no
          cloud services, no network calls. Tests are fast, deterministic, and
          reliable.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          2. Infrastructure Swapability
        </h3>
        <p>
          Gathering uses Azure Blob Storage today. Switching to AWS S3 means
          creating one new class: AwsS3StorageService. The handler, the domain,
          the validators, none of them change.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          3. Parallel Development
        </h3>
        <p>
          One team can build the Application layer while another builds the
          Infrastructure layer. They agree on the interfaces (IRepository,
          IImageStorageService) and work independently. The composition root
          connects them at deployment time.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          4. Clean Compile Dependencies
        </h3>
        <p>
          The Application project does not reference EF Core, Azure SDK, or any
          infrastructure NuGet package. This means changes to Infrastructure
          never force recompilation of Application. Build times stay fast.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          5. Clear Architectural Boundaries
        </h3>
        <p>
          DIP enforces the &ldquo;onion architecture&rdquo;: the core (Domain,
          Application) has zero knowledge of the outer layers (Infrastructure,
          API). This makes the codebase navigable and maintainable as it grows.
        </p>
      </div>

      {/* Pitfalls */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Real-World Pitfalls
        </h2>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Pitfall 1: Abstracting Everything
        </h3>
        <p>
          Not every class needs an interface. Utility classes, value objects,
          and domain entities do not need abstractions. Apply DIP at{" "}
          <span className="font-semibold">architectural boundaries</span>
          (where modules cross layers (Application → Infrastructure, Domain →
          Persistence).
        </p>
        <p className="text-sm italic mt-2">
          Guideline: Abstract the volatile (storage, external APIs, time,
          email). Don&apos;t abstract the stable (string manipulation, math,
          domain value objects).
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Pitfall 2: Interface in the Wrong Layer
        </h3>
        <p>
          If IImageStorageService were defined in Gathering.Infrastructure, the
          Application layer would need to reference Infrastructure, defeating
          the purpose. Always define abstractions in the layer that{" "}
          <span className="font-semibold">consumes</span> them.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Pitfall 3: DI Container as Service Locator
        </h3>
        <p>
          Avoid injecting <span className="font-mono">IServiceProvider</span>{" "}
          and resolving services manually. This hides dependencies and makes
          code harder to understand and test. Use explicit constructor
          injection.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Pitfall 4: Leaky Abstractions
        </h3>
        <p>
          If your interface exposes Azure-specific types (like BlobProperties or
          S3Response), it defeats the purpose of DIP. The interface must use
          domain-level types: streams, strings, Result objects, never
          infrastructure types.
        </p>
      </div>

      {/* Checklist */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Checklist: Detecting DIP Violations
        </h2>

        <div className="space-y-3 my-4">
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <input
              type="checkbox"
              className="mt-1"
              disabled
              readOnly
              defaultChecked
            />
            <label>
              Do your handlers or services directly reference infrastructure
              packages (Azure SDK, EF Core, HTTP clients)?
            </label>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <input
              type="checkbox"
              className="mt-1"
              disabled
              readOnly
              defaultChecked
            />
            <label>
              Do your constructors create their own dependencies using{" "}
              <span className="font-mono">new</span>?
            </label>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <input
              type="checkbox"
              className="mt-1"
              disabled
              readOnly
              defaultChecked
            />
            <label>
              Can you test your business logic without a database, cloud
              service, or network connection?
            </label>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <input
              type="checkbox"
              className="mt-1"
              disabled
              readOnly
              defaultChecked
            />
            <label>
              Are your interfaces defined in the same layer as their
              implementations rather than where they are consumed?
            </label>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <input
              type="checkbox"
              className="mt-1"
              disabled
              readOnly
              defaultChecked
            />
            <label>
              Does changing an infrastructure detail (switching databases,
              upgrading an SDK) force changes in your business logic?
            </label>
          </div>
        </div>

        <p>
          If you answer &ldquo;yes&rdquo; to any of these, DIP is likely being
          violated.
        </p>
      </div>

      {/* Conclusion */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Conclusion</h2>

        <p>
          The Dependency Inversion Principle is what makes all other SOLID
          principles work at the architectural level. By ensuring that
          high-level business logic depends on abstractions, not concrete
          infrastructure, you create systems that are testable, flexible, and
          resilient to change.
        </p>

        <p>
          Gathering demonstrates this through its layered architecture: the
          Domain defines repository interfaces, the Application defines service
          abstractions, and the Infrastructure implements them all. The
          composition root in the API layer wires everything together at
          startup. No handler ever sees a database connection or cloud SDK.
        </p>

        <p>
          The key insight:{" "}
          <span className="font-semibold">
            the direction of source code dependencies should be the opposite of
            the flow of control
          </span>
          . Your business logic calls storage methods at runtime, but the source
          code dependency points from the storage implementation toward the
          business abstraction, not the other way around.
        </p>

        <p>
          This concludes our series on SOLID principles. Together, SRP, OCP,
          LSP, ISP, and DIP form a cohesive design philosophy: build small,
          focused classes (SRP) that are open for extension (OCP), safely
          substitutable (LSP), with focused interfaces (ISP), and wired through
          abstractions (DIP). Mastering these principles is the foundation for
          writing professional, maintainable software.
        </p>
      </div>
    </>
  );
}

import { CodeBlock } from "@/components/code-block";

export function IspContentEn() {
  return (
    <>
      {/* Introduction */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Introduction</h2>
        <p>
          The Interface Segregation Principle (ISP) states:{" "}
          <span className="font-semibold">
            no client should be forced to depend on methods it does not use
          </span>
          . In practical terms, this means preferring several small, focused
          interfaces over one large, general-purpose interface.
        </p>
        <p>
          ISP violations are subtle. A &ldquo;fat&rdquo; interface might seem
          convenient: one contract that covers everything. But when a class
          implements that interface and half the methods throw{" "}
          <span className="font-mono">NotImplementedException</span> or return
          dummy values, something is wrong. The interface is forcing
          implementors to promise capabilities they do not have.
        </p>
        <p>
          This principle matters because fat interfaces create coupling. When
          you depend on an interface with 15 methods but only use 3, changes to
          the other 12 methods can still force you to recompile, retest, and
          redeploy. Focused interfaces minimize this coupling.
        </p>
        <p>
          In this article, we explore ISP through a real-world scenario:
          building a Community of Practice management system. You will see how
          Gathering&apos;s repository design, CQRS abstractions, and storage
          interfaces demonstrate proper interface segregation, and what happens
          when you ignore it.
        </p>
      </div>

      {/* The Problem */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          The Problem: Fat Interfaces
        </h2>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          A Simple Example: Multi-Function Printer
        </h3>

        <p>
          Before diving into the Gathering codebase, let&apos;s see the classic
          ISP violation: a multi-function device interface. This illustrates the
          core principle without needing application context.
        </p>

        <h4 className="text-base font-semibold text-foreground mt-4">
          Without ISP: One Interface to Rule Them All
        </h4>

        <CodeBlock language="csharp">{`public interface IMultiFunctionDevice
{
    void Print(Document doc);
    void Scan(Document doc);
    void Fax(Document doc);
    void Staple(Document doc);
    void PhotoCopy(Document doc);
}

// A basic printer is forced to implement everything
public class BasicInkjetPrinter : IMultiFunctionDevice
{
    public void Print(Document doc)
    {
        // This works fine
        Console.WriteLine("Printing: " + doc.Name);
    }

    public void Scan(Document doc)
    {
        throw new NotSupportedException("This printer cannot scan");
    }

    public void Fax(Document doc)
    {
        throw new NotSupportedException("This printer cannot fax");
    }

    public void Staple(Document doc)
    {
        throw new NotSupportedException("This printer cannot staple");
    }

    public void PhotoCopy(Document doc)
    {
        throw new NotSupportedException("This printer cannot photocopy");
    }
}`}</CodeBlock>

        <p className="mt-4">
          <span className="font-semibold">The problem:</span> BasicInkjetPrinter
          is forced to implement 5 methods but only supports 1. The other 4 are
          landmines: they compile but throw at runtime. Any client that receives
          an <span className="font-mono">IMultiFunctionDevice</span> cannot
          trust that all methods work.
        </p>

        <h4 className="text-base font-semibold text-foreground mt-4">
          With ISP: Focused Interfaces
        </h4>

        <CodeBlock language="csharp">{`// Each capability is its own interface
public interface IPrinter
{
    void Print(Document doc);
}

public interface IScanner
{
    void Scan(Document doc);
}

public interface IFax
{
    void Fax(Document doc);
}

// Basic printer implements only what it supports
public class BasicInkjetPrinter : IPrinter
{
    public void Print(Document doc)
    {
        Console.WriteLine("Printing: " + doc.Name);
    }
}

// Multi-function device implements multiple interfaces
public class OfficePrinter : IPrinter, IScanner, IFax
{
    public void Print(Document doc) { /* ... */ }
    public void Scan(Document doc) { /* ... */ }
    public void Fax(Document doc) { /* ... */ }
}

// Clients depend ONLY on what they need
public class DocumentService
{
    private readonly IPrinter _printer;

    public DocumentService(IPrinter printer)
    {
        // This works with BasicInkjetPrinter AND OfficePrinter
        // No risk of NotSupportedException
        _printer = printer;
    }

    public void PrintDocument(Document doc)
    {
        _printer.Print(doc); // Always safe
    }
}`}</CodeBlock>

        <div className="rounded-lg border border-green-600 bg-green-50 p-4 my-6 dark:bg-green-950/30">
          <p className="font-semibold text-green-900 dark:text-green-100 mb-3">
            Benefits of ISP Here:
          </p>
          <ul className="text-sm text-green-900 dark:text-green-100 space-y-2">
            <li>
              <span className="font-semibold">✓ No dead methods:</span> Every
              class implements only what it actually supports.
            </li>
            <li>
              <span className="font-semibold">✓ Safe for clients:</span>{" "}
              DocumentService knows IPrinter.Print() always works, no runtime
              surprises.
            </li>
            <li>
              <span className="font-semibold">✓ Flexible composition:</span> New
              devices can implement any combination of interfaces.
            </li>
          </ul>
        </div>

        <p className="mt-6">
          This simple pattern (splitting fat interfaces into focused ones) is
          the foundation of ISP. Now let&apos;s apply it to a larger, real-world
          system.
        </p>
      </div>

      {/* Case Study: Repository Interfaces */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Case Study: Repository Interfaces in Gathering
        </h2>

        <p>
          The Gathering application needs repositories for Sessions and
          Communities. A naive approach would create one massive interface for
          all data access. Let&apos;s see what that looks like, and how
          Gathering avoids it.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          The Violation: A Fat Repository Interface
        </h3>

        <CodeBlock language="csharp">{`// ✗ VIOLATION: One interface for everything
public interface IDataRepository
{
    // Session operations
    Task<Session?> GetSessionByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Session>> GetAllSessionsAsync(CancellationToken ct = default);
    Task<IReadOnlyList<Session>> GetSessionsByCommunityIdAsync(
        Guid communityId, CancellationToken ct = default);
    Task<IReadOnlyList<Session>> GetActiveSessionsAsync(CancellationToken ct = default);
    void AddSession(Session session);
    void UpdateSession(Session session);
    void RemoveSession(Session session);

    // Community operations
    Task<Community?> GetCommunityByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Community>> GetAllCommunitiesAsync(CancellationToken ct = default);
    void AddCommunity(Community community);
    void UpdateCommunity(Community community);
    void RemoveCommunity(Community community);

    // Resource operations
    Task<IReadOnlyList<SessionResource>> GetResourcesBySessionIdAsync(
        Guid sessionId, CancellationToken ct = default);
    void AddResource(SessionResource resource);
    void RemoveResource(SessionResource resource);

    // Persistence
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}

// CreateCommunityCommandHandler only needs community operations,
// but it depends on the ENTIRE interface
public class CreateCommunityCommandHandler
{
    private readonly IDataRepository _repository;

    public CreateCommunityCommandHandler(IDataRepository repository)
    {
        _repository = repository;
        // This handler depends on 17+ methods but uses only 2:
        // AddCommunity() and SaveChangesAsync()
    }

    public async Task<Result<Guid>> HandleAsync(CreateCommunityCommand command,
        CancellationToken ct)
    {
        var result = Community.Create(command.Name, command.Description);
        if (result.IsFailure) return Result.Failure<Guid>(result.Error);

        _repository.AddCommunity(result.Value);       // Uses 1 method
        await _repository.SaveChangesAsync(ct);         // Uses 1 method
        return Result.Success(result.Value.Id);
        // The other 15 methods? Unnecessary coupling.
    }
}`}</CodeBlock>

        <div className="rounded-lg border border-red-600 bg-red-50 p-4 my-4 dark:bg-red-950/30">
          <p className="font-semibold text-red-900 dark:text-red-100 mb-3">
            Problems with this Fat Interface:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-red-900 dark:text-red-100">
            <li>
              <span className="font-semibold">Unnecessary coupling:</span>{" "}
              CreateCommunityCommandHandler is coupled to session, resource, and
              community operations, it only needs community operations.
            </li>
            <li>
              <span className="font-semibold">Hard to test:</span> Mocking
              IDataRepository requires implementing 17+ methods even if the test
              only exercises 2.
            </li>
            <li>
              <span className="font-semibold">Change amplification:</span>{" "}
              Adding a new session query method forces recompilation of every
              class that depends on IDataRepository, including community
              handlers that have nothing to do with sessions.
            </li>
            <li>
              <span className="font-semibold">Violated SRP:</span> The interface
              itself has multiple responsibilities (sessions, communities,
              resources, persistence).
            </li>
          </ul>
        </div>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          The Right Approach: Segregated Interfaces
        </h3>

        <p>
          Gathering solves this elegantly by splitting responsibilities into
          focused interfaces. Each interface serves a single role, and clients
          depend only on what they need.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Step 1: Generic Base Repository
        </h3>

        <CodeBlock language="csharp">{`// From: Gathering.Domain/Abstractions/IRepository.cs
public interface IRepository<T> where T : Entity
{
    // Queries
    Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<T>> FindAsync(
        Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default);
    Task<T?> FirstOrDefaultAsync(
        Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default);

    // Existence checks
    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<bool> AnyAsync(
        Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default);

    // Count
    Task<int> CountAsync(CancellationToken cancellationToken = default);
    Task<int> CountAsync(
        Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default);

    // Commands
    void Add(T entity);
    void AddRange(IEnumerable<T> entities);
    void Update(T entity);
    void UpdateRange(IEnumerable<T> entities);
    void Remove(T entity);
    void RemoveRange(IEnumerable<T> entities);
}`}</CodeBlock>

        <p className="mt-4">
          This is a focused, cohesive interface. Every method is about CRUD
          operations on a single entity type. Any repository for any entity
          needs these operations.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Step 2: Specialized Repository Interfaces
        </h3>

        <CodeBlock language="csharp">{`// From: Gathering.Domain/Sessions/ISessionRepository.cs
public interface ISessionRepository : IRepository<Session>
{
    // Only Session-specific queries that go beyond generic CRUD
    Task<IReadOnlyList<Session>> GetByCommunityIdAsync(
        Guid communityId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Session>> GetActiveSessionsAsync(
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<SessionResource>> GetResourcesBySessionIdAsync(
        Guid sessionId,
        CancellationToken cancellationToken = default);

    void AddResource(SessionResource resource);
}

// From: Gathering.Domain/Communities/ICommunityRepository.cs
public interface ICommunityRepository : IRepository<Community>
{
    // No additional methods needed!
    // The base IRepository<Community> is sufficient
}`}</CodeBlock>

        <div className="rounded-lg border border-blue-600 bg-blue-50 p-4 my-6 dark:bg-blue-950/30">
          <p className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Notice the Key ISP Patterns:
          </p>
          <ul className="text-sm text-blue-900 dark:text-blue-100 space-y-2">
            <li>
              <span className="font-semibold">ICommunityRepository</span> adds
              zero methods. The generic interface is enough. No client is forced
              to depend on methods that only sessions need.
            </li>
            <li>
              <span className="font-semibold">ISessionRepository</span> adds
              only session-specific queries. Methods like GetByCommunityIdAsync
              make no sense for communities.
            </li>
            <li>
              <span className="font-semibold">IUnitOfWork</span> is separate
              from repositories. Persistence (SaveChanges) is a different
              concern from data access.
            </li>
          </ul>
        </div>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Step 3: Separate Persistence Concern
        </h3>

        <CodeBlock language="csharp">{`// From: Gathering.Domain/Abstractions/IUnitOfWork.cs
public interface IUnitOfWork : IDisposable
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}`}</CodeBlock>

        <p className="mt-4">
          IUnitOfWork is a single-method interface. It is the ultimate example
          of ISP: one interface, one responsibility. Any handler that needs
          persistence depends on this, nothing more.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Step 4: Handlers Depend Only on What They Need
        </h3>

        <CodeBlock language="csharp">{`// From: Gathering.Application/Communities/Create/CreateCommunityCommandHandler.cs
public sealed class CreateCommunityCommandHandler 
    : ICommandHandler<CreateCommunityCommand, Guid>
{
    private readonly ICommunityRepository _communityRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IValidator<CreateCommunityCommand> _validator;
    private readonly IImageStorageService _imageStorageService;

    public CreateCommunityCommandHandler(
        ICommunityRepository communityRepository,
        IUnitOfWork unitOfWork,
        IValidator<CreateCommunityCommand> validator,
        IImageStorageService imageStorageService)
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
        // Validation...
        var result = Community.Create(command.Name, command.Description);
        if (result.IsFailure) return Result.Failure<Guid>(result.Error);

        _communityRepository.Add(result.Value);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(result.Value.Id);
    }
}`}</CodeBlock>

        <div className="rounded-lg border border-emerald-600 bg-emerald-50 p-4 my-4 dark:bg-emerald-950/30">
          <p className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
            ISP in Action:
          </p>
          <ul className="text-sm space-y-2 text-emerald-900 dark:text-emerald-100">
            <li>
              <span className="font-semibold">ICommunityRepository:</span> Only
              community CRUD. No session methods polluting the dependency.
            </li>
            <li>
              <span className="font-semibold">IUnitOfWork:</span> Only
              SaveChangesAsync. Not mixed with repository queries.
            </li>
            <li>
              <span className="font-semibold">IImageStorageService:</span> Only
              Upload and Delete. Not a fat IFileService with 20 methods.
            </li>
            <li>
              <span className="font-semibold">IValidator:</span> Only validates
              CreateCommunityCommand. Not a generic validator for all commands.
            </li>
          </ul>
        </div>
      </div>

      {/* Case Study: CQRS Interfaces */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Case Study: CQRS Interface Segregation
        </h2>

        <p>
          Gathering&apos;s CQRS (Command Query Responsibility Segregation)
          pattern is another powerful ISP example. Instead of one{" "}
          <span className="font-mono">IRequestHandler</span> that handles both
          reads and writes, commands and queries have separate interfaces.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          The Violation: One Handler for Everything
        </h3>

        <CodeBlock language="csharp">{`// ✗ VIOLATION: One fat interface for all operations
public interface IHandler<TRequest, TResponse>
{
    Task<TResponse> HandleAsync(TRequest request, CancellationToken ct);
    
    // Commands need validation, queries don't
    Task<ValidationResult> ValidateAsync(TRequest request);
    
    // Commands need unit of work, queries don't
    Task SaveChangesAsync(CancellationToken ct);
    
    // Queries need pagination, commands don't
    Task<PagedResult<TResponse>> HandlePagedAsync(
        TRequest request, int page, int pageSize);
}

// A query handler is forced to implement command-specific methods
public class GetSessionByIdHandler : IHandler<GetSessionQuery, SessionDto>
{
    public async Task<SessionDto> HandleAsync(
        GetSessionQuery request, CancellationToken ct)
    {
        // This works fine
        return await _repository.GetByIdAsync(request.Id, ct);
    }

    public Task<ValidationResult> ValidateAsync(GetSessionQuery request)
    {
        // Queries don't need FluentValidation - forced to implement
        throw new NotImplementedException();
    }

    public Task SaveChangesAsync(CancellationToken ct)
    {
        // Queries don't write data - forced to implement
        throw new NotImplementedException();
    }

    public Task<PagedResult<SessionDto>> HandlePagedAsync(
        GetSessionQuery request, int page, int pageSize)
    {
        // Not all queries need paging - forced to implement
        throw new NotImplementedException();
    }
}`}</CodeBlock>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          The Right Approach: Segregated Command and Query Interfaces
        </h3>

        <CodeBlock language="csharp">{`// From: Gathering.Application/Abstractions/ICommand.cs
public interface ICommand : IRequest<Result>, IBaseCommand { }

public interface ICommand<TResponse> : IRequest<Result<TResponse>>, IBaseCommand { }

// From: Gathering.Application/Abstractions/ICommandHandler.cs
public interface ICommandHandler<TCommand> : IRequestHandler<TCommand, Result>
    where TCommand : ICommand { }

public interface ICommandHandler<TCommand, TResponse> 
    : IRequestHandler<TCommand, Result<TResponse>>
    where TCommand : ICommand<TResponse> { }

// From: Gathering.Application/Abstractions/IQuery.cs
public interface IQuery<TResponse> : IRequest<Result<TResponse>> { }

// From: Gathering.Application/Abstractions/IQueryHandler.cs
public interface IQueryHandler<TQuery, TResponse> 
    : IRequestHandler<TQuery, Result<TResponse>>
    where TQuery : IQuery<TResponse> { }`}</CodeBlock>

        <p className="mt-4">
          Each interface has{" "}
          <span className="font-semibold">exactly one method</span> (inherited
          from IRequestHandler): the Handle method. But the segregation is in
          the <span className="font-semibold">type constraints</span>:
        </p>

        <ul className="list-disc list-inside space-y-2">
          <li>
            <span className="font-semibold">ICommandHandler</span> handles only
            ICommand types. Commands modify state and return Result.
          </li>
          <li>
            <span className="font-semibold">IQueryHandler</span> handles only
            IQuery types. Queries read state and return data.
          </li>
          <li>
            No handler is forced to implement methods for the other category.
          </li>
        </ul>

        <CodeBlock language="csharp">{`// A command handler - only implements command handling
public sealed class CreateSessionCommandHandler 
    : ICommandHandler<CreateSessionCommand, Guid>
{
    private readonly ISessionRepository _sessionRepository;
    private readonly ICommunityRepository _communityRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IValidator<CreateSessionCommand> _validator;
    private readonly IImageStorageService _imageStorageService;

    public CreateSessionCommandHandler(
        ISessionRepository sessionRepository,
        ICommunityRepository communityRepository,
        IUnitOfWork unitOfWork,
        IValidator<CreateSessionCommand> validator,
        IImageStorageService imageStorageService)
    {
        _sessionRepository = sessionRepository;
        _communityRepository = communityRepository;
        _unitOfWork = unitOfWork;
        _validator = validator;
        _imageStorageService = imageStorageService;
    }

    public async Task<Result<Guid>> HandleAsync(
        CreateSessionCommand request, 
        CancellationToken cancellationToken = default)
    {
        // Validate, check community exists, upload image, create session, save
        // ...
        _sessionRepository.Add(sessionResult.Value);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success(sessionResult.Value.Id);
    }
}`}</CodeBlock>
      </div>

      {/* Case Study: Image Storage */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Case Study: Focused Storage Interface
        </h2>

        <p>
          Another ISP pattern in Gathering is the image storage abstraction.
          Instead of a fat <span className="font-mono">IFileService</span> that
          handles every file operation imaginable, Gathering defines a focused
          interface for exactly what the application needs.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          The Violation: A Swiss-Army-Knife File Service
        </h3>

        <CodeBlock language="csharp">{`// ✗ VIOLATION: Too many capabilities in one interface
public interface IFileService
{
    // Image operations (needed by Gathering)
    Task<Result<string>> UploadImageAsync(Stream stream, string fileName,
        string contentType, string entityType, CancellationToken ct);
    Task<Result> DeleteImageAsync(string url, CancellationToken ct);

    // Document operations (not needed by Gathering)
    Task<Result<string>> UploadDocumentAsync(Stream stream, string fileName,
        CancellationToken ct);
    Task<Result<byte[]>> DownloadDocumentAsync(string url, CancellationToken ct);
    Task<Result<string>> ConvertToPdfAsync(string documentUrl, CancellationToken ct);

    // Video operations (not needed by Gathering)
    Task<Result<string>> UploadVideoAsync(Stream stream, string fileName,
        CancellationToken ct);
    Task<Result<string>> GenerateThumbnailAsync(string videoUrl, CancellationToken ct);
    Task<Result<TimeSpan>> GetVideoDurationAsync(string videoUrl, CancellationToken ct);

    // General file operations (not needed by handlers)
    Task<bool> FileExistsAsync(string url, CancellationToken ct);
    Task<Result<long>> GetFileSizeAsync(string url, CancellationToken ct);
    Task<Result<IReadOnlyList<string>>> ListFilesAsync(string prefix, CancellationToken ct);
}

// CreateCommunityCommandHandler depends on 12 methods but uses only 2
public class CreateCommunityCommandHandler
{
    private readonly IFileService _fileService;
    // All 12 methods are visible and "available" but irrelevant
}`}</CodeBlock>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          The Right Approach: Only What You Need
        </h3>

        <CodeBlock language="csharp">{`// From: Gathering.Application/Abstractions/IImageStorageService.cs
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
          Two methods. That is the entire interface. Every handler that needs
          image operations depends on exactly what it needs: upload and delete,
          nothing more.
        </p>

        <CodeBlock language="csharp">{`// From: Gathering.Infrastructure/Storage/AzureBlobStorageService.cs
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
                HttpHeaders = new BlobHttpHeaders { ContentType = contentType }
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

        <div className="rounded-lg border border-green-600 bg-green-50 p-4 my-6 dark:bg-green-950/30">
          <p className="font-semibold text-green-900 dark:text-green-100 mb-3">
            ISP Benefits in Practice:
          </p>
          <ul className="text-sm text-green-900 dark:text-green-100 space-y-2">
            <li>
              <span className="font-semibold">✓ Easy to implement:</span>{" "}
              AzureBlobStorageService implements 2 methods, not 12. The
              implementation is focused and straightforward.
            </li>
            <li>
              <span className="font-semibold">✓ Easy to mock:</span> Tests only
              need to set up 2 methods. Test setup is minimal.
            </li>
            <li>
              <span className="font-semibold">✓ Easy to swap:</span> Switching
              from Azure to AWS means implementing 2 methods in a new class, not
              12.
            </li>
            <li>
              <span className="font-semibold">✓ Stable interface:</span> Adding
              video processing features does not affect IImageStorageService.
              Those would go in a separate IVideoStorageService.
            </li>
          </ul>
        </div>
      </div>

      {/* TypeScript Section */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          ISP in TypeScript
        </h2>

        <p>
          The same principles apply in TypeScript. Here is the repository and
          storage pattern translated to a Node.js context:
        </p>

        <CodeBlock language="typescript">
          {`// Generic repository interface - focused on CRUD
interface IRepository<T extends Entity> {
  getById(id: string): Promise<T | null>;
  getAll(): Promise<ReadonlyArray<T>>;
  find(predicate: (entity: T) => boolean): Promise<ReadonlyArray<T>>;
  exists(id: string): Promise<boolean>;

  add(entity: T): void;
  update(entity: T): void;
  remove(entity: T): void;
}

// Segregated persistence interface
interface IUnitOfWork {
  saveChanges(): Promise<number>;
}

// Session-specific extension
interface ISessionRepository extends IRepository<Session> {
  getByCommunityId(communityId: string): Promise<ReadonlyArray<Session>>;
  getActiveSessions(): Promise<ReadonlyArray<Session>>;
}

// Community repository - no extra methods needed
interface ICommunityRepository extends IRepository<Community> {
  // Base IRepository is sufficient
}

// Focused image storage - only what the app needs
interface IImageStorageService {
  uploadImage(
    stream: NodeJS.ReadableStream,
    fileName: string,
    contentType: string,
    entityType: string
  ): Promise<Result<string>>;

  deleteImage(imageUrl: string): Promise<Result<void>>;
}

// ✗ FAT interface violation
interface IFileService {
  uploadImage(stream: NodeJS.ReadableStream, fileName: string): Promise<Result<string>>;
  deleteImage(url: string): Promise<Result<void>>;
  uploadDocument(stream: NodeJS.ReadableStream, fileName: string): Promise<Result<string>>;
  downloadDocument(url: string): Promise<Result<Buffer>>;
  convertToPdf(documentUrl: string): Promise<Result<string>>;
  uploadVideo(stream: NodeJS.ReadableStream, fileName: string): Promise<Result<string>>;
  generateThumbnail(videoUrl: string): Promise<Result<string>>;
  // 7 methods... and growing
}

// ✓ Handler depends only on focused interfaces
class CreateCommunityHandler {
  constructor(
    private communityRepository: ICommunityRepository,
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

    this.communityRepository.add(result.value);
    await this.unitOfWork.saveChanges();

    return success(result.value.id);
  }
}`}
        </CodeBlock>
      </div>

      {/* Benefits */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Benefits of Applying ISP
        </h2>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          1. Reduced Coupling
        </h3>
        <p>
          Each handler depends on exactly the interfaces it needs. Changes to
          ISessionRepository do not affect CreateCommunityCommandHandler.
          Changes to IImageStorageService do not affect query handlers that
          never upload images.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          2. Simpler Testing
        </h3>
        <p>
          Mocking IUnitOfWork means implementing one method. Mocking
          IImageStorageService means implementing two. Compare that to mocking a
          17-method IDataRepository for every test.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          3. Clearer Intent
        </h3>
        <p>
          A constructor that takes ICommunityRepository, IUnitOfWork, and
          IImageStorageService tells you exactly what the handler does: it
          manages communities, persists changes, and handles images. A
          constructor that takes IDataRepository tells you nothing.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          4. Independent Evolution
        </h3>
        <p>
          You can add new methods to ISessionRepository (e.g.,
          GetUpcomingSessionsAsync) without touching ICommunityRepository or its
          implementations. Each interface evolves independently.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          5. Better DI Registration
        </h3>
        <p>
          With focused interfaces, dependency injection is precise. You register
          each interface with its implementation. With a fat interface, one
          registration handles everything, making it harder to swap individual
          components.
        </p>
      </div>

      {/* Pitfalls */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Real-World Pitfalls
        </h2>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Pitfall 1: Interface Explosion
        </h3>
        <p>
          Splitting too aggressively creates dozens of single-method interfaces
          that are hard to navigate. The goal is not to minimize methods per
          interface but to group{" "}
          <span className="font-semibold">cohesive operations</span>.
          IRepository groups CRUD operations because they naturally belong
          together.
        </p>
        <p className="text-sm italic mt-2">
          Guideline: If methods always change together and serve the same
          client, keep them in one interface.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Pitfall 2: Splitting Based on Implementation, Not Client Needs
        </h3>
        <p>
          ISP is about the{" "}
          <span className="font-semibold">client&apos;s perspective</span>, not
          the implementor&apos;s. Don&apos;t split an interface because the
          implementation is complex, split it because different clients need
          different subsets.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Pitfall 3: Marker Interfaces Without Purpose
        </h3>
        <p>
          ICommunityRepository adds no methods to IRepository. That is fine, it
          exists as a distinct type for dependency injection and future
          extension. But creating empty interfaces &ldquo;just in case&rdquo;
          without a clear DI or extension purpose adds noise.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Pitfall 4: Ignoring Interface Inheritance
        </h3>
        <p>
          C# supports interface inheritance (ISessionRepository extends
          IRepository). Use this to compose focused interfaces rather than
          duplicating method signatures across separate interfaces.
        </p>
      </div>

      {/* Checklist */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Checklist: Detecting ISP Violations
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
              Do implementations throw{" "}
              <span className="font-mono">NotImplementedException</span> for
              some interface methods?
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
              Do clients depend on interfaces where they use less than half the
              methods?
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
              Does adding a method to an interface force changes in classes that
              have nothing to do with that method?
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
              Is it difficult to mock an interface in tests because it has too
              many methods?
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
              Does the interface mix different categories of operations (e.g.,
              images, documents, and videos)?
            </label>
          </div>
        </div>

        <p>
          If you answer &ldquo;yes&rdquo; to any of these, ISP is likely being
          violated.
        </p>
      </div>

      {/* Conclusion */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Conclusion</h2>

        <p>
          The Interface Segregation Principle transforms how you design
          contracts. Instead of one-size-fits-all interfaces that force clients
          to depend on methods they never use, you create focused interfaces
          that match what each client actually needs.
        </p>

        <p>
          Gathering demonstrates this through its repository hierarchy
          (IRepository → ISessionRepository / ICommunityRepository), its CQRS
          abstractions (ICommandHandler vs IQueryHandler), and its storage
          interface (IImageStorageService with just 2 methods). Each interface
          is cohesive, focused, and easy to implement and test.
        </p>

        <p>
          The key insight:{" "}
          <span className="font-semibold">
            design interfaces from the client&apos;s perspective, not the
            implementor&apos;s
          </span>
          . Ask &ldquo;what does this consumer need?&rdquo;, not &ldquo;what can
          this implementation do?&rdquo;
        </p>

        <p>
          In the next article, we explore the Dependency Inversion Principle,
          which ensures that high-level modules depend on abstractions rather
          than concrete implementations, the final piece that makes all SOLID
          principles work together.
        </p>
      </div>
    </>
  );
}

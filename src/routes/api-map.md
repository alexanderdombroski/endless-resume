# GET /api/resumes

    ?q=string
    &date_Start=01-01-2026
    &date_end=12-01-2026
    &page=1
    &offset=0

- Get the list of resumes

## Types:

### Request Type:

type GetResumesQuery = {
q?: string;
date_start?: string; // ISO preferred: "2026-01-01"
date_end?: string; // ISO preferred: "2026-12-01"
page?: number;
offset?: number;
};

### Response:

type GetResumesResponse = {
resumes: Resume[];
page: number;
offset: number;
returned: number;
};

# GET /api/resumes/:id

- Retrieve the resume with the given ID.

## Types:

### Request:

type GetResumeParams = {
id: string;
};

### Response:

type GetResumeResponse = {
resume: Resume;
};

# POST /api/resumes

- Create a new resume

## Types:

### Request:

type CreateResumeRequest = {
title: string;
subtitle: {
label: string;
value: string;
}[];
sections: Section[];
spacing: {
bullet: number;
section: number;
};
font: {
family: string;
sizes: {
title: number;
heading: number;
bullet: number;
};
};
};

### Response:

type CreateResumeResponse = {
message: "Resume created successfully";
_id: string;
title: string;
createdAt: string;
};

# POST /api/resumes/:id

- Duplicate the resume with the given ID.

## Types:

### Request:

type DuplicateResumeParams = {
id: string;
title: string; (This will be the new title as provided by the user)
};

### Response:

type DuplicateResumeResponse = {
message: "Resume duplicated successfully";
originalResumeId: string;
_id: string; (The new resume ID)
title: string; (The new resume title)
createdAt: string;
};

# PUT /api/resumes/:id

- Edit the resume with the given ID.
- For simplicity, we will be replacing the entire object in the database.

## Types:

### Request:

type UpdateResumeParams = {
id: string;
};

type UpdateResumeRequest = {
title: string;
subtitle: {
label: string;
value: string;
}[];
sections: Section[];
spacing: {
bullet: number;
section: number;
};
font: {
family: string;
sizes: {
title: number;
heading: number;
bullet: number;
};
};
};

### Response:

type UpdateResumeResponse = {
message: "Resume updated successfully";
id: string; //(The updated resume ID.)
title: string; //(The updated resume title)
updatedAt: string;
};

# DELETE /api/resumes/:id

- Remove the Resume with the given ID.

## Types:

### Request:

type DeleteResumeParams = {
id: string;
};

### Response:

type DeleteResumeResponse = {
message: "Resume deleted successfully";
id: string; //(The deleted resume's ID.)
title: string; //(The deleted resume's title)
updatedAt: string;
};

# Global types:

## Error Response:

type ApiErrorResponse = {
message: string;
status: number;
errors?: unknown;
};

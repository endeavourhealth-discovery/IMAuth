import { rest } from "msw";
import { Services, Vocabulary } from "im-library";
const { Env } = Services;
const { IM } = Vocabulary;

const apiUrl = "http://localhost:8082/imapi/api/";

export const handlers = [
  rest.post(apiUrl + "query/public/entityQuery", async (req, res, ctx) => {
    const body = await req.json();
    if (body.queryIri["@id"] === "http://endhealth.info/im#Query_GetIsas") {
      if (body.argument.this === "http://endhealth.info/im#Status")
        return res(
          ctx.status(200),
          ctx.json([
            { "@id": IM.ACTIVE, "http://www.w3.org/2000/01/rdf-schema#label": "Active" },
            { "@id": IM.DRAFT, "http://www.w3.org/2000/01/rdf-schema#label": "Draft" },
            { "@id": IM.INACTIVE, "http://www.w3.org/2000/01/rdf-schema#label": "Inactive" }
          ])
        );
      else return res(ctx.status(200), ctx.json([]));
    } else
      return res(
        ctx.status(403),
        ctx.json({
          errorMessage:
            "Fetch mocking is active for this api. Fetch request query iri caught by msw handler. Please mock the fetch request for this iri parameter response in the handler file."
        })
      );
  }),
  rest.post(apiUrl + "function/public/callFunction", async (req, res, ctx) => {
    const body = await req.json();
    if (body.functionIri === "http://endhealth.info/im#GetAdditionalAllowableTypes") return res(ctx.status(200), ctx.json([]));
    else
      return res(
        ctx.status(403),
        ctx.json({
          errorMessage:
            "Fetch mocking is active for this api. Fetch request function iri caught by msw handler. Please mock the fetch request for this iri parameter response in the handler file."
        })
      );
  })
];

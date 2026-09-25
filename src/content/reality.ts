export const REALITY = {
  teaches: "What the game teaches",
  site: "What this means on a real jobsite",
  important:
    "This training does not replace employer/site-specific orientation, practical instruction, certification, authorization, or regulatory requirements where applicable.",
};

export const REALITY_BY_MODULE: Record<string, { teaches: string; site: string }> = {
  orientation: {
    teaches: "How to find the office, the muster point, and the people who can answer a question.",
    site: "The real yard has its own map, its own sign-in, and its own rules. Learn those on that site.",
  },
  ppe: {
    teaches: "How to match protection to the hazard in front of you.",
    site: "The PPE for a task comes from the hazard, the SDS, and the employer. A vest is not a harness.",
  },
  hazards: {
    teaches: "How to see a hazard and choose a control, starting with the ones that remove the hazard.",
    site: "The control on a real task can be set by the province, the employer, and the site plan.",
  },
  tools: {
    teaches: "How to take a damaged tool out of service.",
    site: "Your employer decides who may use a tool and how a lockout is done. This game does not authorize the tool.",
  },
  falls: {
    teaches: "How a bad ladder set and a missing anchor show up before someone climbs.",
    site: "Work at height can require hands-on training and a site-specific fall plan. Passing this module is not that training.",
  },
  whmis: {
    teaches: "How to read a label and a safety data sheet, and what to do with an unidentified product.",
    site: "WHMIS education in the workplace, and training on the products you actually use, are the employer’s duty. This lab is not that sign-off.",
  },
  conduct: {
    teaches: "How to speak up about a shortcut, a joke, or a task you are not cleared for.",
    site: "The reporting path, the harassment process, and who you call are set by the workplace.",
  },
  report: {
    teaches: "How a near miss still gets reported.",
    site: "Use the form, the radio, or the person your site named. This app is not the record.",
  },
  emergency: {
    teaches: "How an alarm, a route, and a muster point fit together.",
    site: "The real plan is the one posted on that site. Learn the route there.",
  },
  shift: {
    teaches: "How the morning’s calls fit into one shift.",
    site: "A simulated morning is practice. The first real shift still starts with that employer’s orientation.",
  },
};

globalThis.require = (name) => {
    if (name === "ethers") {
      return ethers;
    }
    throw new Error("unknown module " + name);
  };
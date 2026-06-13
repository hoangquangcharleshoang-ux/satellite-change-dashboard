import ee

ee.Authenticate()
ee.Initialize(project="project-gis-499303")

print(ee.String("Earth Engine is ready").getInfo())